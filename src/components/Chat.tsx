import React from 'react';
import io from 'socket.io-client';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

import icon from '../images/emoji.svg';
//import styles from '../styles/Chat.module.css';
import Messages from './Messages';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { styleChat01, styleChat02 } from './ComponentsStyle';
import { styleChat03, styleChat04, styleChat16 } from './ComponentsStyle';
import { styleChat05, styleChat06, styleChat07 } from './ComponentsStyle';
import { styleChatInp01, styleChatInp02 } from './ComponentsStyle';
import { styleChatInp03, styleChat041 } from './ComponentsStyle';

let ioo: any = io;
const socket = ioo.connect('http://localhost:5000');

//let resStr = [];
//let inputer = 0;

//let soob = '';

const Chat = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ room: '', user: '' } as any);
  const [state, setState] = useState<Array<any>>([]);
  const [message, setMessage] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [users, setUsers] = useState(0);
  //const [trigger, setTrigger] = useState(false);
  const divRef: any = React.useRef(null);

  useEffect(() => {
    const searchParams: any = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit('join', searchParams);

    return () => {
      socket.off();
    };
  }, [search]);

  useEffect(() => {
    socket.on('message', (event: any) => {
      setState((_state) => [..._state, event.data]);
    });
    divRef.current.scrollIntoView();
  }, []);

  useEffect(() => {
    socket.on('room', (event: any) => {
      setUsers(event.data.users.length);
      divRef.current.scrollIntoView();
    });
  }, []);

  const leftRoom = () => {
    socket.emit('leftRoom', { params });
    navigate('/');
  };

  const handleChange = (event: any) => {
    //divRef.current.scrollIntoView({ behavior: "smooth" });
    setMessage(event.target.value);
    //soob = event.target.value;
    divRef.current.scrollIntoView();
  };

  const handleSubmit = () => {
    //divRef.current.scrollTop = divRef.current.scrollHeight;
    //divRef.scrollIntoView({ behavior: "smooth" });
    divRef.current.scrollIntoView(true);

    //e.preventDefault();
    //console.log('soob:', soob);
    if (!message) return;

    socket.emit('sendMessage', { message, params });
    setMessage('');
    //window.scrollTo(0, 1000);
    //soob = '';
    //divRef.current.scrollIntoView();
    //scrollTo(0, 0);
  };

  // const handleSub = () => {
  //   console.log('1-й проход');
  //   handleSubmit();
  //   console.log('2-й проход');
  //   handleSubmit();

  //   //setTrigger(!trigger)
  // };

  const onEmojiClick = (event: any) => setMessage(`${message} ${event.emoji}`);

  const handleKey = (event: any) => {
    if (event.key === 'Enter') event.preventDefault();
  };

  // useLayoutEffect(() => {
  //   // 👇️ scroll to bottom every time messages change
  //   divRef.current.scrollIntoView();
  // }, []);

  //useEffect(() => window.scrollTo(0, 1000), []);

  return (
    <Box sx={styleChat01}>
      <Box sx={styleChat02}>
        <Box sx={styleChat03}>{params.room}</Box>
        <Box>{users} чел в этой комнате</Box>
        <Button sx={styleChat04} variant="contained" onClick={leftRoom}>
          Покинуть комнату
        </Button>
      </Box>

      <Box sx={styleChat05}>
        <Box sx={{ overflowX: 'auto', height: '88vh' }}>
          <Messages messages={state} name={params.name} />
          <div ref={divRef} />
        </Box>
      </Box>

      {/* <form className={styles.form} onSubmit={handleSubmit}> */}
      <Box sx={styleChat16}>
        <Box sx={styleChatInp01}>
          <TextField
            size="small"
            onKeyPress={handleKey} //отключение Enter
            placeholder="Что вы хотите сказать?"
            InputProps={{ disableUnderline: true, style: styleChatInp02 }}
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
      {/* </form> */}
    </Box>
  );
};

export default Chat;
