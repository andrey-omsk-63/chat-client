import React from 'react';
import io from 'socket.io-client';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

import icon from '../images/emoji.svg';
import styles from '../styles/Chat.module.css';
import Messages from './Messages';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { styleMainChat01, styleMainChat02 } from './ComponentsStyle';
import { styleMainChat03, styleMainChat04 } from './ComponentsStyle';
import { styleMainChat05, styleMainChat06 } from './ComponentsStyle';

// const socket = io.connect("https://online-chat-900l.onrender.com");
let ioo: any = io;
const socket = ioo.connect('http://localhost:5000');

const Chat = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ room: '', user: '' } as any);
  const [state, setState] = useState<Array<any>>([]);
  const [message, setMessage] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [users, setUsers] = useState(0);

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
  }, []);

  console.log('state:', state);

  useEffect(() => {
    socket.on('room', (event: any) => {
      setUsers(event.data.users.length);
    });
  }, []);

  const leftRoom = () => {
    socket.emit('leftRoom', { params });
    navigate('/');
  };

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!message) return;
    socket.emit('sendMessage', { message, params });
    setMessage('');
  };

  const onEmojiClick = (event: any) => setMessage(`${message} ${event.emoji}`);

  return (
    <Box sx={styleMainChat01}>
      <Box sx={styleMainChat02}>
        <Box sx={styleMainChat03}>{params.room}</Box>
        <Box>{users} чел в этой комнате</Box>
        <Button sx={styleMainChat04} variant="contained" onClick={leftRoom}>
          Покинуть комнату
        </Button>
      </Box>

      <Box sx={styleMainChat05}>
        <Messages messages={state} name={params.name} />
      </Box>

      {/* <Grid container sx={styleMainChat06}> */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            type="text"
            name="message"
            placeholder="Что вы хотите сказать?"
            value={message}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.emoji}>
          <img src={icon} alt="" onClick={() => setOpen(!isOpen)} />

          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        <div className={styles.button}>
          <input type="submit" onSubmit={handleSubmit} value="Отправить сообщение" />
        </div>
      </form>
      {/* </Grid> */}
    </Box>
  );
};

export default Chat;
