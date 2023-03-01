import React from 'react';
import io from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import axios from 'axios';

import icon from '../images/emoji.svg';
import Messages from './Messages';

import { styleChat01, styleChat02, styleChat08 } from './ComponentsStyle';
import { styleChat021, styleChat022 } from './ComponentsStyle';
import { styleChat03, styleChat04, styleChat16 } from './ComponentsStyle';
import { styleChat05, styleChat06, styleChat07 } from './ComponentsStyle';
import { styleChatInp01, styleChatInp02 } from './ComponentsStyle';
import { styleChatInp03, styleChat041 } from './ComponentsStyle';
import { styleChatBut01 } from './ComponentsStyle';

const ioo: any = io;
const socket = ioo.connect('http://localhost:5000');

let usersRooms: any = [];
let debug = false;
let flagOpenDebug = true;
let chatReady = 0;
let oldName = 'oldName';
let oldRoom = 'oldRoom';

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
  const [params, setParams] = React.useState({ room: '', user: '' } as any);
  const [state, setState] = React.useState<Array<any>>([]);
  const [message, setMessage] = React.useState('');
  const [isOpen, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState(0);
  //const [sistUsers, setSistUsers] = React.useState<Array<any>>([]);
  //const [trigger, setTrigger] = React.useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();
  const divRef: any = React.useRef(null);

  let WS = props.ws;
  if (WS.url.slice(0, 21) === 'wss://localhost:3000/') debug = true;
  //console.log('props:', props, params);

  const PostingArchive = React.useCallback((archive: any, room: string) => {
    console.log('PostingArchive', room, archive);
    for (let i = 0; i < archive.messages.length; i++) {
      if (archive.messages[i].from === room || archive.messages[i].to === room) {
        maskSoob.user.name = archive.messages[i].from;
        maskSoob.message = archive.messages[i].message;
        maskSoob.date = archive.messages[i].time;
        let mass = JSON.parse(JSON.stringify(maskSoob));
        setState((_state) => [..._state, mass]);
      }
    }
  }, []);

  //=== инициализация ======================================
  if (debug && flagOpenDebug) {
    console.log('РЕЖИМ ОТЛАДКИ!!!');
    let ipAdress: string = 'http://localhost:3000/otladkaUsers.json';
    axios.get(ipAdress).then(({ data }) => {
      //setSistUsers(data.data.users);
      sistUsers = data.data.users;
      chatReady++;
    });
    ipAdress = 'http://localhost:3000/otladkaArchive.json';
    axios.get(ipAdress).then(({ data }) => {
      archive = data.data.archive;
      chatReady++;
      PostingArchive(data.data.archive, 'Global');
    });
    flagOpenDebug = false;
  }
  //console.log('1params:', params, oldName, oldRoom);

  //========================================================
  React.useEffect(() => {
    WS.onopen = function (event: any) {
      //console.log("WS.current.onopen:", event);
    };
    WS.onclose = function (event: any) {
      //console.log("WS.current.onclose:", event);
    };
    WS.onerror = function (event: any) {
      //console.log("WS.current.onerror:", event);
    };
    WS.onmessage = function (event: any) {
      let allData = JSON.parse(event.data);
      let data = allData.data;
      //console.log("пришло:", data.error, allData.type, data);
      switch (allData.type) {
        case 'users':
          //setSistUsers(data.users);
          sistUsers = data.users;
          break;
        case 'archive':
          archive = data.archive;
          PostingArchive(data.archive, 'Global');
          break;
        case 'getBindings':
          break;
        case 'getAddObjects':
          break;
        case 'getPhases':
          break;
        case 'getSvg':
          break;
        default:
          console.log('data_default:', data);
      }
    };
  }, [WS, PostingArchive]);

  //window.localStorage.getItem("login")
  //=== РЕЖИМ ОТЛАДКИ ======================================
  React.useEffect(() => {
    const searchParams: any = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    console.log('3params:', searchParams, oldName, oldRoom);
    if (oldName !== 'oldName' && oldRoom !== 'oldRoom') {
      //console.log('4params:', searchParams, oldName, oldRoom);
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
    socket.emit('leftRoom', { params });
    navigate('/');
  };

  React.useEffect(() => {
    socket.on('message', (event: any) => {
      //console.log('event.data:', params.name, params.room, event.data);
      let mask = {
        from: event.data.user.name,
        to: event.data.user.room,
        message: event.data.message,
        time: event.data.date,
      };
      archive.messages.push(mask);
      //console.log('HHHHandleSubmit', archive.messages);
      setTimeout(() => {
        setState((_state) => [..._state, event.data]);
      }, 50);
      setTimeout(() => {
        // 👇️ scroll to bottom every time messages change
        divRef.current && divRef.current.scrollIntoView();
      }, 100);
    });
    socket.on('room', (event: any) => {
      setUsers(event.data.users.length);
      usersRooms = event.data.users;
      // 👇️ scroll to bottom every time messages change
      divRef.current && divRef.current.scrollIntoView();
    });
  }, []);
  //========================================================
  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    console.log('handleSubmit', message, params);
    if (!message) return;
    let date = new Date().toISOString();
    socket.emit('sendMessage', { message, params, date });
    setMessage('');
  };

  const onEmojiClick = (event: any) => setMessage(`${message} ${event.emoji}`);

  const handleKey = (event: any) => {
    if (event.key === 'Enter') event.preventDefault();
  };

  let chel = 'человек';
  if (users !== 12 && users !== 13 && users !== 14) {
    if (users % 10 === 2 || users % 10 === 3 || users % 10 === 4) chel += 'а';
  }

  //console.log('1@@@@@@', params, state)

  const LeftPartChat = () => {
    let nameRoom = ' в этой комнате';
    let redKnop = 'Покинуть комнату';
    if (params.room === 'Global') {
      nameRoom = ' чате';
      redKnop = 'Выйти из чата';
    }
    return (
      <>
        <Box sx={styleChat02}>
          <Box sx={styleChat03}>{params.room}</Box>
          <Box>
            {users} {chel} {nameRoom}
          </Box>
          <Button sx={styleChat04} variant="contained" onClick={leftRoom}>
            {redKnop}
          </Button>
        </Box>

        <Box sx={styleChat05}>
          <Box sx={{ overflowX: 'auto', height: '86vh' }}>
            <Messages messages={state} name={params.name} />
            <div ref={divRef} />
          </Box>
        </Box>

        <Box sx={styleChat16}>
          <Box sx={styleChatInp01}>
            <TextField
              size="small"
              onKeyPress={handleKey} //отключение Enter
              placeholder="Что вы хотите сказать?"
              InputProps={{
                disableUnderline: true,
                style: styleChatInp02,
              }}
              value={message}
              onChange={handleChange}
              variant="standard"
            />
          </Box>

          <Box sx={styleChat06}>
            <img src={icon} alt="" onClick={() => setOpen(!isOpen)} />
            {isOpen && (
              <Box sx={styleChat07}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </Box>
            )}
          </Box>

          <Box sx={styleChatInp03}>
            <Button sx={styleChat041} onClick={handleSubmit}>
              Отправить сообщение
            </Button>
          </Box>
        </Box>
      </>
    );
  };

  const UsersChat = () => {
    let resStr: any = [];
    for (let i = 0; i < usersRooms.length; i++) {
      let nameer = usersRooms[i].name;
      if (nameer.length > 15) nameer = nameer.slice(0, 15);
      resStr.push(
        <Grid key={i} item container xs={12}>
          <Grid item xs={12} sx={styleChat08}>
            <b>{nameer}</b>
          </Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  const ClickKnop = (mode: number) => {
    console.log('Click1:', sistUsers[mode].user, params);
    let newParams = params;
    newParams.room = sistUsers[mode].user;
    setParams(newParams);
    setState([]);
    //let ar = archive.messages[0];
    //archive.messages.push(ar);
    PostingArchive(archive, newParams.room);
    oldName = newParams.name;
    oldRoom = newParams.room;
    console.log('Click2:', params, state);
    socket.emit('join', params);
    return () => {
      socket.off();
    };
    //setTrigger(!trigger);
  };

  const UsersSist = () => {
    let resStr: any = [];
    for (let i = 0; i < sistUsers.length; i++) {
      let nameer = sistUsers[i].user;
      if (nameer.length > 15) nameer = nameer.slice(0, 15);
      resStr.push(
        <Grid key={i} item container xs={12}>
          <Grid item xs={12} sx={styleChat08}>
            <Button variant="contained" sx={styleChatBut01} onClick={() => ClickKnop(i)}>
              {sistUsers[i].status !== 'online' && <em>{nameer}</em>}
              {sistUsers[i].status === 'online' && <b>{nameer}</b>}
            </Button>
          </Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  //console.log("###:", chatReady, state);

  return (
    <Grid container>
      <Grid item xs={10} sx={styleChat01}>
        {chatReady > 1 && <>{LeftPartChat()}</>}
      </Grid>

      <Grid item xs={2} sx={styleChat01}>
        <Grid container sx={styleChat021}>
          <Grid item xs={12} sx={styleChat022}>
            Пользователи в
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            комнате:
          </Grid>
        </Grid>
        <Box sx={{ overflowX: 'auto', height: '21vh' }}>{UsersChat()}</Box>

        <Grid container sx={styleChat021}>
          <Grid item xs={12} sx={styleChat022}>
            Пользователи в
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            системе:
          </Grid>
        </Grid>
        <Box sx={{ overflowX: 'auto', height: '64vh' }}>{UsersSist()}</Box>
      </Grid>
    </Grid>
  );
};

export default Chat;
