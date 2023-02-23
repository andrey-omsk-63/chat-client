import React from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

//import styles from '../styles/Messages.module.css';

import { styleMess01, styleMeUser, styleUserUser } from './ComponentsStyle';
//import { styleMeText, styleUserText } from './ComponentsStyle';

let resStr: any = [];

const Messages = (props: { messages: any; name: string }) => {
  const divRef: any = React.useRef(null);

  const MesssgeLength = (text: string, fontSize: number) => {
    function textWidth(text: string, fontProp: any) {
      let tag = document.createElement('div');
      tag.style.position = 'absolute';
      tag.style.left = '-999em';
      tag.style.whiteSpace = 'nowrap';
      tag.style.font = fontProp;
      tag.innerHTML = text;
      document.body.appendChild(tag);
      let result = tag.clientWidth;
      document.body.removeChild(tag);
      return result;
    }

    let theCSSprop = window.getComputedStyle(document.body, null).getPropertyValue('font-family');
    let bb = 'bold ' + fontSize + 'px ' + theCSSprop;
    // let aa = textWidth('🐷 🐷', 'bold 13px Segoe UI');
    // console.log('AA:', aa);
    return textWidth(text, bb);
  };

  const StrMessages = () => {
    resStr = [];
    for (let i = 0; i < props.messages.length; i++) {
      let itsme = false;
      if (props.messages[i].user.name.trim().toLowerCase() === props.name.trim().toLowerCase())
        itsme = true;

      //let dlina = (props.messages[i].message.length + 3) * 9;
      let dlina = MesssgeLength(props.messages[i].message, 16) + 14;

      const styleMeText = {
        width: dlina,
        border: 2,
        height: '36px',
        fontSize: '16px',
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
        width: dlina,
        border: 2,
        height: '36px',
        fontSize: '16px',
        background: '#93E5EE', //зелёный
        borderColor: '#93E5EE',
        borderRadius: 3,
        color: 'black',
        marginTop: 0.5,
        padding: '6px 0px 6px 6px',
        marginBottom: 1,
      };

      let styleUser: any = styleMeUser;
      if (!itsme) styleUser = styleUserUser;
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
    // resStr.push(<Box>{divRef && divRef.current.scrollIntoView()}</Box>);
    return resStr;
  };

  // const scrollToBottom = (id: any) => {
  //   const element = document.getElementById(id);

  //   if (element) {
  //     // console.log('111', element.scrollTop, element.scrollHeight);
  //     // element.scrollTop = element.scrollHeight;
  //     console.log('222', element.scrollTop, element.scrollHeight);
  //     element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
  //   }
  // };

  return (
    <Box ref={divRef} sx={styleMess01}>
      {StrMessages()}
    </Box>
  );
};

export default Messages;
