import React from 'react';
import io from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
//import EmojiPicker from 'emoji-picker-react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

//import icon from '../images/emoji.svg';
import Messages from './Messages';

import { MakeSpisUsers, InputerMessage } from './ChatServiceFunctions';
import { HeaderChat, HeaderSist, UsersChat } from './ChatServiceFunctions';
import { SendMessage } from './ChatServiceFunctions';

import { styleChat01, styleChat02, styleChat08 } from './ComponentsStyle';
import { styleChat03, styleChat04, styleChat16 } from './ComponentsStyle';
import {
  styleChat05,
  //styleChat06, styleChat07
} from './ComponentsStyle';
import { styleChatBut01, styleChat081 } from './ComponentsStyle';

import { dataArchive } from './../otladkaArchive';
import { dataUsers } from './../otladkaUsers';

const ioo: any = io;
const socket = ioo.connect('http://localhost:5000');

let usersRooms: any = [];
let debug = false;
let flagOpenDebug = true;
//let chatReady = 0;
let oldName = 'oldName';
let oldRoom = 'oldRoom';
let nameKomu = 'Global';

let archive: any = [];
let sistUsers: Array<any> = [];
let maskSoob = {
  user: {
    name: 'ChatAdmin',
  },
  message: '123, и снова здравствуйте',
  date: new Date(),
};

const Chat = (props: { ws: WebSocket; nik: any }) => {
  //const [params, setParams] = React.useState({ room: '', user: '' } as any);
  const [params, setParams] = React.useState({ name: '', room: '' } as any);
  const [state, setState] = React.useState<Array<any>>([]);
  const [stateBasket, setStateBasket] = React.useState<Array<any>>([]);
  const [message, setMessage] = React.useState('');
  //const [isOpen, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState(0);
  const [chatReady, setChatReady] = React.useState(0);
  //const [trigger, setTrigger] = React.useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();
  const divRef: any = React.useRef(null);

  let WS = props.ws;
  if (WS.url.slice(0, 21) === 'wss://localhost:3000/') debug = true;
  //console.log("props:",debug, props, params);

  const PostingArchive = React.useCallback((archive: any, room: string) => {
    console.log('PostingArchive', room, archive);
    for (let i = 0; i < archive.length; i++) {
      if (archive[i].to === room) {
        maskSoob.user.name = archive[i].from;
        maskSoob.message = archive[i].message;
        maskSoob.date = archive[i].time;
        archive[i].read = true;
        let mass = JSON.parse(JSON.stringify(maskSoob));
        setState((_state) => [..._state, mass]);
        setStateBasket((_stateBasket) => [..._stateBasket, mass]);
      }
    }
  }, []);

  //=== инициализация ======================================
  //if (debug && flagOpenDebug) {
  if (flagOpenDebug) {
    console.log('РЕЖИМ ОТЛАДКИ!!!');
    setTimeout(() => {
      let arch = dataArchive.archive;
      for (let i = 0; i < arch.messages.length; i++) {
        let mask = {
          from: arch.messages[i].from,
          to: arch.messages[i].to,
          message: arch.messages[i].message,
          time: arch.messages[i].time,
          read: false,
        };
        archive.push(mask);
      }
      setState([]);
      setStateBasket([]);
      PostingArchive(archive, 'Global');
      //chatReady++;
      let ch = chatReady + 1;
      setChatReady(ch);
      sistUsers = MakeSpisUsers(dataUsers.users);
      console.log('sistUsers', sistUsers);
      //chatReady++;
      ch = chatReady + 1;
      setChatReady(ch);
      console.log('1params:', archive, state, chatReady);
      if (!debug) setParams({ name: props.nik, room: 'Global' });
    }, 100);
    flagOpenDebug = false;
  }
  //console.log('props:', debug, props, ':', params);
  //========================================================
  React.useEffect(() => {
    WS.onopen = function (event: any) {
      console.log('WS.current.onopen:', event);
    };
    WS.onclose = function (event: any) {
      console.log('WS.current.onclose:', event);
    };
    WS.onerror = function (event: any) {
      console.log('WS.current.onerror:', event);
    };
    WS.onmessage = function (event: any) {
      let allData = JSON.parse(event.data);
      let data = allData.data;
      console.log('пришло:', data.error, allData.type, data);
      switch (allData.type) {
        case 'users':
          sistUsers = MakeSpisUsers(data.users);
          break;
        case 'archive':
          let arch = data.archive;
          for (let i = 0; i < arch.messages.length; i++) {
            let mask = {
              from: arch.messages[i].from,
              to: arch.messages[i].to,
              message: arch.messages[i].message,
              time: arch.messages[i].time,
              read: false,
            };
            archive.push(mask);
          }
          PostingArchive(archive, 'Global');
          break;
        case 'getBindings':
          break;
        default:
          console.log('data_default:', data);
      }
    };
  }, [WS, PostingArchive]);

  //=== РЕЖИМ ОТЛАДКИ ======================================
  React.useEffect(() => {
    const searchParams: any = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    console.log('3params:', searchParams, oldName, oldRoom);
    if (oldName !== 'oldName' && oldRoom !== 'oldRoom') {
      if (oldName !== searchParams.name || oldRoom !== searchParams.room) {
        console.log('2params:', archive);
        PostingArchive(archive, searchParams.room);
        oldName = searchParams.name;
        oldRoom = searchParams.room;
      }
    } else {
      oldName = searchParams.name;
      oldRoom = searchParams.room;
    }
    socket.emit('join', searchParams);
    return () => {
      socket.off();
    };
  }, [search, PostingArchive]);

  const leftRoom = () => {
    if (params.room !== 'Global') {
      nameKomu = 'Global';
      let newParams = params;
      newParams.room = nameKomu;
      setParams(newParams);
      setState([]);
      setStateBasket([]);
      PostingArchive(archive, nameKomu);
      oldName = newParams.name;
      oldRoom = nameKomu;
      socket.emit('join', params);
      return () => {
        socket.off();
      };
    } else {
      socket.emit('leftRoom', { params });
      navigate('/');
    }
  };

  React.useEffect(() => {
    socket.on('message', (event: any) => {
      //console.log('event.data:', event.data, '::', oldRoom, archive);
      let toTo = true;
      if (event.data.to !== oldRoom) toTo = false;
      let mask = {
        from: event.data.user.name,
        to: event.data.to,
        message: event.data.message,
        time: event.data.date,
        read: toTo,
      };
      if (archive.length) archive.push(mask);
      console.log('HHHHandleSubmit', archive);
      setTimeout(() => {
        if (event.data.to === oldRoom) {
          setState((_state) => [..._state, event.data]);
        } else {
          setStateBasket((_stateBasket) => [..._stateBasket, event.data]);
        }
      }, 100);
      setTimeout(() => {
        // 👇️ scroll to bottom every time messages change
        divRef.current && divRef.current.scrollIntoView();
      }, 150);
    });
    socket.on('room', (event: any) => {
      console.log('ROOM:', event);
      setUsers(event.data.users.length);
      usersRooms = event.data.users;
      // 👇️ scroll to bottom every time messages change
      divRef.current && divRef.current.scrollIntoView();
    });
  }, []);
  //========================================================
  const handleChange = (event: any) => {
    //console.log('handleChange:', event.target.value);
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    if (!message) return;
    let date = new Date().toISOString();
    socket.emit('sendMessage', { message, params, date });
    setMessage('');
  };

  //const onEmojiClick = (event: any) => setMessage(`${message} ${event.emoji}`);

  const TopPartChat = () => {
    let chel = 'человек';
    if (users !== 12 && users !== 13 && users !== 14) {
      if (users % 10 === 2 || users % 10 === 3 || users % 10 === 4) chel += 'а';
    }
    let nameRoom = ' комнате';
    let redKnop = 'Покинуть комнату';
    if (params.room === 'Global') {
      nameRoom = ' чате';
      redKnop = 'Выйти из чата';
    }
    let roomName = 'Групповой чат';
    if (nameKomu !== 'Global') roomName = nameKomu + '/' + params.name;

    return (
      <Box sx={styleChat02}>
        <Box sx={styleChat03}>{roomName}</Box>
        <Box>
          {users} {chel} {nameRoom}
        </Box>
        <Button sx={styleChat04} variant="contained" onClick={leftRoom}>
          {redKnop}
        </Button>
      </Box>
    );
  };

  const BottomPartChat = () => {
    return (
      <Box sx={styleChat16}>
        {InputerMessage(message, handleChange)}
        {/* <Box sx={styleChat06}>
          <img src={icon} alt="" onClick={() => setOpen(!isOpen)} />
          {isOpen && (
            <Box sx={styleChat07}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </Box>
          )}
        </Box> */}
        {SendMessage(handleSubmit)}
      </Box>
    );
  };

  const ClickKnop = (mode: number) => {
    socket.emit('leftRoom', { params });
    let newParams = params;
    let id1 = sistUsers[mode].id; // кому
    nameKomu = sistUsers[mode].user;
    let id2 = '00';
    for (let i = 0; i < sistUsers.length; i++) {
      if (sistUsers[i].user === params.name) id2 = sistUsers[i].id; // от кого
    }
    let roomer = id1 + id2;
    if (Number(id2) < Number(id1)) roomer = id2 + id1;
    newParams.room = roomer;
    setParams(newParams);
    setState([]);
    setStateBasket([]);
    PostingArchive(archive, roomer);
    oldName = newParams.name;
    oldRoom = roomer;
    console.log('ClickKnop:', params, newParams);
    socket.emit('join', params);
    return () => {
      socket.off();
    };
  };

  const UsersSist = () => {
    let resStr: any = [];
    for (let i = 0; i < sistUsers.length; i++) {
      let nameer = sistUsers[i].user;
      if (nameer.length > 15) nameer = nameer.slice(0, 15);
      let point = ' ';
      for (let j = 0; j < archive.length; j++) {
        if (archive[j].from !== 'ChatAdmin' && archive[j].from === sistUsers[i].user) {
          if (archive[j].to !== 'Global' && !archive[j].read) point = '●';
        }
      }
      resStr.push(
        <Grid key={i} container>
          <Grid item xs={0.7} sx={styleChat081}>
            {point}
          </Grid>
          <Grid item xs sx={styleChat08}>
            {sistUsers[i].user !== params.name && sistUsers[i].user !== nameKomu && (
              <Button variant="contained" sx={styleChatBut01} onClick={() => ClickKnop(i)}>
                {sistUsers[i].status !== 'online' && <em>{nameer}</em>}
                {sistUsers[i].status === 'online' && <b>{nameer}</b>}
              </Button>
            )}
            {sistUsers[i].user === params.name && (
              <Box sx={{ padding: '0.5vh 0 0 0' }}>
                <b>{nameer}</b>
              </Box>
            )}
            {sistUsers[i].user === nameKomu && (
              <Box sx={{ padding: '0.5vh 0 0 0' }}>
                <b>{nameer}</b>
              </Box>
            )}
          </Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  const LeftPartChat = () => {
    return (
      <>
        {TopPartChat()}
        <Box sx={styleChat05}>
          <Box sx={{ overflowX: 'auto', height: '86vh' }}>
            <Messages messages={state} name={params.name} basket={stateBasket} />
            <div ref={divRef} />
          </Box>
        </Box>
        {BottomPartChat()}
      </>
    );
  };

  let chatRoom = 'чате:';
  if (params.room !== 'Global') chatRoom = 'комнате:';

  return (
    <Grid container>
      <Grid item xs={10} sx={styleChat01}>
        {/* {chatReady > 1 && <>{LeftPartChat()}</>} */}
        {LeftPartChat()}
      </Grid>

      <Grid item xs sx={styleChat01}>
        <Box sx={{ background: '#D3D3D3' }}>
          {HeaderChat(chatRoom)}
          <Box sx={{ overflowX: 'auto', height: '7vh' }}>{UsersChat(usersRooms)}</Box>
          {HeaderSist()}
          <Box sx={{ overflowX: 'auto', height: '78.5vh' }}>{UsersSist()}</Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Chat;
