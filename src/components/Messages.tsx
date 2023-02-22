import React from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

//import styles from '../styles/Messages.module.css';

import { styleMess01, styleMeUser, styleUserUser } from './ComponentsStyle';
//import { styleMeText, styleUserText } from './ComponentsStyle';

const Messages = (props: { messages: any; name: string }) => {
  let resStr: any = [];
  const StrMessages = () => {
    resStr = [];
    for (let i = 0; i < props.messages.length; i++) {
      let itsme = false;
      if (props.messages[i].user.name.trim().toLowerCase() === props.name.trim().toLowerCase())
        itsme = true;

      let dlina = props.messages[i].message.length;

      const styleMeText = {
        width: (dlina + 3) * 9,
        border: 2,
        height: '36px',
        fontSize: 16,
        background: '#fafac3', // жёлтый
        borderColor: '#fafac3',
        borderRadius: 3,
        color: 'black',
        marginTop: 0.5,
        padding: '6px 0px 6px 6px',
        marginLeft: 'auto',
        marginBottom: 1,
      };

      const styleUserText = {
        width: (dlina + 3) * 9,
        border: 2,
        height: '36px',
        fontSize: 16,
        background: '#93E5EE', //зелёный
        borderColor: '#93E5EE',
        borderRadius: 3,
        color: 'black',
        marginTop: 0.5,
        padding: '6px 0px 6px 6px',
        marginBottom: 1,
      };

      let styleUser: any = styleMeUser;
      if (itsme) styleUser = styleUserUser;
      let styleText: any = styleMeText;
      if (!itsme) styleText = styleUserText;

      resStr.push(
        <Grid key={i} item container xs={12}>
          <Grid item xs={12} sx={styleUser}>
            {props.messages[i].user.name}
          </Grid>
          <Grid item xs={12}>
            <Box sx={styleText}>{props.messages[i].message}</Box>
          </Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  StrMessages();

  return <Box sx={styleMess01}>{resStr}</Box>;
};

export default Messages;
