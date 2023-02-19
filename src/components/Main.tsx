import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { styleMainBox02, styleMainBox03 } from './ComponentsStyle';
import { styleMainBox04, styleMainBox05 } from './ComponentsStyle';
import { styleMainBox06 } from './ComponentsStyle';

import styles from '../styles/Main.module.css';

const FIELDS = {
  NAME: 'name',
  ROOM: 'room',
};

const Main = () => {
  const { NAME, ROOM } = FIELDS;

  const [values, setValues] = React.useState({ [NAME]: '', [ROOM]: '' });

  const handleChange = (event: any) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleClick = (e: any) => {
    const isDisabled = Object.values(values).some((v) => !v);
    if (isDisabled) e.preventDefault();
  };

  return (
    <Box sx={{ border: 0, width: '100%', height: '100vh' }}>
      <Box sx={styleMainBox02}>
        <Box sx={styleMainBox03}>
          <b>Присоединиться</b>
        </Box>
        <Grid container sx={styleMainBox04}>
          <Box sx={styleMainBox05}>
            <input
              type="text"
              name="name"
              value={values[NAME]}
              placeholder="Имя пользователя"
              className={styles.input}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </Box>

          <Box sx={styleMainBox05}>
            <input
              type="text"
              name="room"
              placeholder="Комната"
              value={values[ROOM]}
              className={styles.input}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </Box>

          <Link to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}>
            <Button sx={styleMainBox06} variant="contained" onClick={handleClick}>
              Войти
            </Button>
          </Link>
        </Grid>
      </Box>
    </Box>
  );
};

export default Main;
