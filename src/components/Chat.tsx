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

import { styleChat01, styleChat02 } from './ComponentsStyle';
import { styleChat021, styleChat022 } from './ComponentsStyle';
import { styleChat03, styleChat04, styleChat16 } from './ComponentsStyle';
import { styleChat05, styleChat06, styleChat07 } from './ComponentsStyle';
import { styleChatInp01, styleChatInp02 } from './ComponentsStyle';
import { styleChatInp03, styleChat041 } from './ComponentsStyle';

const ioo: any = io;
const socket = ioo.connect('http://localhost:5000');

let usersRooms: any = [];
let debug = false;
let flagOpenDebug = true;

let archive: any = null;
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
  const [sistUsers, setSistUsers] = React.useState<Array<any>>([]);
  const { search } = useLocation();
  const navigate = useNavigate();
  const divRef: any = React.useRef(null);

  let WS = props.ws;
  if (WS.url.slice(0, 21) === 'wss://localhost:3000/') debug = true;

  const PostingArchive = () => {
    for (let i = 0; i < archive.messages.length; i++) {
      maskSoob.user.name = archive.messages[i].from;
      maskSoob.message = archive.messages[i].message;
      maskSoob.date = archive.messages[i].time;
      state.push(JSON.parse(JSON.stringify(maskSoob)));
      //setState((_state) => [..._state, JSON.parse(JSON.stringify(maskSoob))]);
    }
  };

  //=== инициализация ======================================
  if (debug && flagOpenDebug) {
    console.log('РЕЖИМ ОТЛАДКИ!!!');
    let ipAdress: string = 'http://localhost:3000/otladkaUsers.json';
    axios.get(ipAdress).then(({ data }) => {
      setSistUsers(data.data.users);
    });
    ipAdress = 'http://localhost:3000/otladkaArchive.json';
    axios.get(ipAdress).then(({ data }) => {
      archive = data.data.archive;
      PostingArchive();
    });
    flagOpenDebug = false;
  }

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
      //console.log("пришло:", data.error, allData.type, data);
      switch (allData.type) {
        case 'users':
          setSistUsers(data.users);
          break;
        case 'archive':
          archive = data.archive;
          PostingArchive();
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
  }, []);

  //window.localStorage.getItem("login")
  //=== РЕЖИМ ОТЛАДКИ ======================================
  React.useEffect(() => {
    const searchParams: any = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit('join', searchParams);

    return () => {
      socket.off();
    };
  }, [search]);

  const leftRoom = () => {
    socket.emit('leftRoom', { params });
    navigate('/');
  };

  React.useEffect(() => {
    socket.on('message', (event: any) => {
      console.log('event.data:', event.data);
      setState((_state) => [..._state, event.data]);
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
    if (!message) return;
    let date = new Date().toISOString();
    //console.log('DATE:', date);
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

  //console.log('@@@@@@',state,params.name)

  const LeftPartChat = () => {
    return (
      <>
        <Box sx={styleChat02}>
          <Box sx={styleChat03}>{params.room}</Box>
          <Box>
            {users} {chel} в этой комнате
          </Box>
          <Button sx={styleChat04} variant="contained" onClick={leftRoom}>
            Покинуть комнату
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
          <Grid item xs={12} sx={{ fontSize: 12.9, textAlign: 'center', padding: '1vh 0 0 0' }}>
            <b>{nameer}</b>
          </Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  const UsersSist = () => {
    let resStr: any = [];
    for (let i = 0; i < sistUsers.length; i++) {
      let nameer = sistUsers[i].user;
      if (nameer.length > 15) nameer = nameer.slice(0, 15);
      resStr.push(
        <Grid key={i} item container xs={12}>
          {sistUsers[i].status === 'online' && (
            <Grid item xs={12} sx={{ fontSize: 12.9, textAlign: 'center', padding: '1vh 0 0 0' }}>
              <b>{nameer}</b>
            </Grid>
          )}
          {sistUsers[i].status !== 'online' && (
            <Grid item xs={12} sx={{ fontSize: 12.9, textAlign: 'center', padding: '1vh 0 0 0' }}>
              {nameer}
            </Grid>
          )}
        </Grid>,
      );
    }
    return resStr;
  };

  //console.log('###:', usersRooms, sistUsers);

  return (
    <Grid container>
      <Grid item xs={10} sx={styleChat01}>
        {LeftPartChat()}
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
        <Box sx={{ overflowX: 'auto', height: '32vh' }}>{UsersChat()}</Box>

        <Grid container sx={styleChat021}>
          <Grid item xs={12} sx={styleChat022}>
            Пользователи в
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            системе:
          </Grid>
        </Grid>
        <Box sx={{ overflowX: 'auto', height: '53vh' }}>{UsersSist()}</Box>
      </Grid>
    </Grid>
  );
};

export default Chat;
