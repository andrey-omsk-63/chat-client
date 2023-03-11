import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Messages from './Messages';

import { MakeSpisUsers, InputerMessage } from './ChatServiceFunctions';
import { HeaderChat, HeaderSist, UsersChat } from './ChatServiceFunctions';
import { SendMessage, SendSocketSendMessage } from './ChatServiceFunctions';

import { styleChat01, styleChat02, styleChat08 } from './ComponentsStyle';
import { styleChat03, styleChat04, styleChat16 } from './ComponentsStyle';
import { styleChat05, styleChat06, styleChat07 } from './ComponentsStyle';
import { styleChatBut01, styleChat081, styleChat061 } from './ComponentsStyle';

import { dataArchive } from './../otladkaArchive';
import { dataUsers } from './../otladkaUsers';

let usersRooms: any = [];
let debug = false;
let flagOpenDebug = true;
let oldName = 'oldName';
let oldRoom = 'oldRoom';
let nameKomu = 'Global';

let archive: any = [];
let sistUsers: any = [];

const Chat = (props: { ws: WebSocket; Socket: any; nik: any }) => {
  let socket = props.Socket;
  const [params, setParams] = React.useState({ name: '', room: '' } as any);
  const [state, setState] = React.useState<Array<any>>([]);
  const [stateBasket, setStateBasket] = React.useState<Array<any>>([]);
  const [message, setMessage] = React.useState('');
  const [isOpen, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState<number | any>(-5);
  const [trigger, setTrigger] = React.useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();
  const divRef: any = React.useRef(null);

  let WS = props.ws;
  if (WS.url.slice(0, 21) === 'wss://localhost:3000/') debug = true;

  const PostingArchive = React.useCallback((archive: any, room: string) => {
    console.log('PostingArchive', room, archive);
    for (let i = 0; i < archive.length; i++) {
      if (archive[i].to === room) {
        let maskSoob = {
          user: { name: archive[i].from },
          message: archive[i].message,
          date: archive[i].time,
        };
        archive[i].read = true;
        setState((_state) => [..._state, maskSoob]);
        setStateBasket((_stateBasket) => [..._stateBasket, maskSoob]);
      }
    }
    Scrooler();
  }, []);

  const BeginWorkInRoom = React.useCallback(
    (room: string) => {
      setState([]);
      setStateBasket([]);
      PostingArchive(archive, room);
    },
    [PostingArchive],
  );

  const BeginWork = React.useCallback(
    (arch: any) => {
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
      if (!debug) {
        let mask = {
          from: 'ChatAdmin',
          to: 'Global',
          message: '🙋 Здравствуйте, ' + props.nik,
          time: new Date().toISOString(),
          read: false,
        };
        archive.push(mask);
        let mess = '👨' + props.nik + ' присоеденился';
        SendSocketSendMessage(props.ws, mess, 'ChatAdmin', 'Global');
      }
      BeginWorkInRoom('Global');
    },
    [BeginWorkInRoom, props.ws, props.nik],
  );

  const Scrooler = () => {
    setTimeout(() => {
      // 👇️ scroll to bottom every time messages change
      divRef.current && divRef.current.scrollIntoView();
    }, 150);
  };

  //=== инициализация ======================================
  if (flagOpenDebug) {
    if (debug) {
      console.log('РЕЖИМ ОТЛАДКИ!!!');
      setTimeout(() => {
        BeginWork(dataArchive.archive);
        let aa = MakeSpisUsers(dataUsers.users);
        sistUsers = aa[0];
      }, 100);
      Scrooler();
    } else {
      setParams({ name: props.nik, room: 'Global' });
      oldName = props.nik;
      oldRoom = 'Global';
    }
    flagOpenDebug = false;
  }
  //=== работа на сервере ==================================
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
      console.log('пришло:', users, data.error, allData.type, data);
      switch (allData.type) {
        case 'users':
          let aa = MakeSpisUsers(data.users);
          sistUsers = aa[0];
          setUsers(aa[1]);
          break;
        case 'archive':
          setTimeout(() => {
            BeginWork(data.archive);
          }, 100);
          break;
        case 'message':
          let toTo = true;
          let komu = data.to;
          if (komu !== 'Global') {
            let id1 = '00';
            let id2 = '00';
            for (let i = 0; i < sistUsers.length; i++) {
              if (sistUsers[i].user === komu) id1 = sistUsers[i].id; // кому
              if (sistUsers[i].user === data.from) id2 = sistUsers[i].id; // от кого
            }
            let roomer = id1 + id2;
            if (Number(id2) < Number(id1)) roomer = id2 + id1;
            komu = roomer;
          }
          if (komu !== oldRoom) toTo = false;
          let mask = {
            from: data.from,
            to: komu,
            message: data.message,
            time: data.time,
            read: toTo,
          };
          archive.push(mask);
          setTimeout(() => {
            let maska = {
              user: { name: data.from, room: data.to },
              message: data.message,
              date: data.time,
              to: komu,
            };
            if (oldRoom === komu) {
              setState((_state) => [..._state, maska]);
            } else {
              setStateBasket((_stateBasket) => [..._stateBasket, maska]);
            }
            setTrigger(!trigger);
          }, 100);
          Scrooler();
          break;
        case 'status':
          console.log('Status:', users, data.user, data.status);
          for (let i = 0; i < sistUsers.length; i++) {
            if (sistUsers[i].user === data.user) {
              sistUsers[i].status = data.status;
              if (sistUsers[i].status === 'online') setUsers(users + 1);
              if (sistUsers[i].status === 'offline') setUsers(users - 1);
            }
          }
          setTrigger(!trigger);
          //let mess = ' вышел';
          //if (data.status === 'online') mess = ' присоеденился';
          //SendSocketSendMessage(props.ws, data.user + mess, 'ChatAdmin', 'Global');
          // let maskSt = {
          //   from: 'ChatAdmin',
          //   to: 'Global',
          //   message: data.user + mess,
          //   time: new Date().toISOString(),
          //   read: true,
          // };
          // archive.push(maskSt);
          // setTimeout(() => {
          //   let maska = {
          //     user: { name: 'ChatAdmin' },
          //     message: data.user + mess,
          //     date: new Date().toISOString(),
          //     to: 'Global',
          //   };
          //   if (oldRoom === 'Global') {
          //     setState((_state) => [..._state, maska]);
          //   } else {
          //     setStateBasket((_stateBasket) => [..._stateBasket, maska]);
          //   }
          //   setTrigger(!trigger);
          // }, 100);
          // Scrooler();
          break;
        default:
          console.log('data_default:', data);
      }
    };
  }, [WS, PostingArchive, BeginWork, trigger, users]);
  //=== РЕЖИМ ОТЛАДКИ ======================================
  React.useEffect(() => {
    if (debug) {
      const searchParams: any = Object.fromEntries(new URLSearchParams(search));
      setParams(searchParams);
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
    }
  }, [socket, search, PostingArchive]);

  React.useEffect(() => {
    if (debug) {
      socket.on('message', (event: any) => {
        let toTo = true;
        if (event.data.to !== oldRoom) toTo = false;
        let mask = {
          from: event.data.user.name,
          to: event.data.to,
          message: event.data.message,
          time: event.data.date,
          read: toTo,
        };
        archive.push(mask);
        //console.log("HHHHandleSubmit", archive);
        setTimeout(() => {
          if (event.data.to === oldRoom) {
            setState((_state) => [..._state, event.data]);
          } else {
            setStateBasket((_stateBasket) => [..._stateBasket, event.data]);
          }
        }, 100);
        Scrooler();
      });
      socket.on('room', (event: any) => {
        setUsers(event.data.users.length);
        usersRooms = event.data.users;
        divRef.current && divRef.current.scrollIntoView();
      });
    }
  }, [socket]);
  //========================================================
  const leftRoom = () => {
    if (params.room !== 'Global') {
      nameKomu = 'Global';
      let newParams = params;
      newParams.room = nameKomu;
      setParams(newParams);
      BeginWorkInRoom(nameKomu);
      oldName = newParams.name;
      oldRoom = nameKomu;
      if (debug) {
        socket.emit('join', params);
        return () => {
          socket.off();
        };
      }
    } else {
      if (debug) {
        socket.emit('leftRoom', { params });
        navigate('/');
      } else {
        let mess = '🏃' + props.nik + ' вышел';
        SendSocketSendMessage(props.ws, mess, 'ChatAdmin', 'Global');
        window.close();
      }
    }
  };

  const ClickKnop = (mode: number) => {
    if (debug) socket.emit('leftRoom', { params });
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
    BeginWorkInRoom(roomer);
    oldName = newParams.name; // от кого
    oldRoom = roomer;
    console.log('3ClickKnop:', params, newParams, oldRoom, oldName);
    if (debug) {
      socket.emit('join', params);
      return () => {
        socket.off();
      };
    }
  };

  const handleChange = (event: any) => setMessage(event.target.value);

  const handleSubmit = () => {
    if (!message) return;
    let date = new Date().toISOString();
    if (debug) {
      socket.emit('sendMessage', { message, params, date });
    } else {
      SendSocketSendMessage(props.ws, message, params.name, nameKomu);
    }
    setMessage('');
  };

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
        {debug && (
          <Box>
            {users} {chel} {nameRoom}
          </Box>
        )}
        {!debug && params.room === 'Global' && (
          <Box>
            {users} {chel} {nameRoom}
          </Box>
        )}
        <Button sx={styleChat04} variant="contained" onClick={leftRoom}>
          {redKnop}
        </Button>
      </Box>
    );
  };

  const onEmojiClick = (event: any) => setMessage(`${message} ${event.emoji}`);

  const BottomPartChat = () => {
    return (
      <Box sx={styleChat16}>
        {InputerMessage(message, handleChange)}
        <Box sx={styleChat06}>
          <Button sx={styleChat061} onClick={() => setOpen(!isOpen)}>
            😎
          </Button>
          {isOpen && (
            <Box sx={styleChat07}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </Box>
          )}
        </Box>
        {SendMessage(handleSubmit)}
      </Box>
    );
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
                {sistUsers[i].status !== 'online' && <em>{nameer}</em>}
                {sistUsers[i].status === 'online' && <b>{nameer}</b>}
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
        {LeftPartChat()}
      </Grid>
      <Grid item xs sx={styleChat01}>
        <Box sx={{ background: '#D3D3D3' }}>
          {debug && (
            <>
              {HeaderChat(chatRoom)}
              <Box sx={{ overflowX: 'auto', height: '7vh' }}>{UsersChat(usersRooms)}</Box>
            </>
          )}
          {HeaderSist()}
          <Box sx={{ overflowX: 'auto', height: '78.5vh' }}>{UsersSist()}</Box>
          {!debug && <Grid container sx={{ height: '14vh' }}></Grid>}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Chat;
