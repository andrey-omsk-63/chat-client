import React from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { MesssgeLength, Splitter } from './ChatServiceFunctions';

import { styleMess01, styleMeUser } from './ComponentsStyle';

let resStr: any = [];

const Messages = (props: { messages: any; name: string; basket: any }) => {
  // const Splitter = (str: string, l: number) => {
  //   let strs = [];
  //   while (str.length > l) {
  //     var pos = str.substring(0, l).lastIndexOf(' ');
  //     pos = pos <= 0 ? l : pos;
  //     strs.push(str.substring(0, pos));
  //     var i = str.indexOf(' ', pos) + 1;
  //     if (i < pos || i > pos + l) i = pos;
  //     str = str.substring(i);
  //   }
  //   strs.push(str);
  //   return strs;
  // };

  const StrMessages = () => {
    resStr = [];
    for (let i = 0; i < props.messages.length; i++) {
      let itsme = false;
      if (props.messages[i].user.name.trim().toLowerCase() === props.name.trim().toLowerCase())
        itsme = true;
      let coler = 'black';
      if (!itsme && props.messages[i].user.name === 'ChatAdmin') coler = 'blue';
      let dlina = MesssgeLength(props.messages[i].message, 13.5) + 14;
      let mass: string[] = [props.messages[i].message];

      if (props.messages[i].message.length > 40) {
        mass = Splitter(props.messages[i].message, 69);
        let dl = MesssgeLength(mass[0], 13.5) + 14;
        console.log('Text:', dl, mass);
        dlina = 505;
      }

      const styleMeText = {
        width: dlina,
        border: 2,
        height: '27px',
        fontSize: '13.5px',
        //background: "#fafac3", // жёлтый
        background: '#93E5EE', //зелёный
        borderColor: '#93E5EE',
        borderRadius: 3,
        color: 'black',
        marginTop: 0.3,
        padding: '3px 0px 0 6px',
        marginLeft: 'auto',
        marginBottom: 1,
        boxShadow: 2,
      };

      const styleUserText = {
        width: dlina,
        border: 2,
        height: '27px',
        fontSize: '13.5px',
        //background: "#93E5EE", //зелёный
        background: '#fafac3', // жёлтый
        borderColor: '#fafac3',
        borderRadius: 3,
        color: coler,
        marginTop: 0.3,
        padding: '3px 0px 0 6px',
        marginBottom: 1,
        boxShadow: 2,
      };

      const styleUserUser = {
        fontSize: '11.5px',
        color: coler,
        paddingLeft: '9px',
      };

      let dat =
        new Date(props.messages[i].date).toLocaleDateString() !== new Date().toLocaleDateString()
          ? new Date(props.messages[i].date).toLocaleDateString()
          : '';
      let tim = new Date(props.messages[i].date).toLocaleTimeString().slice(0, -3);

      const MassMessages = () => {
        let resSt = [];
        for (let j = 0; j < mass.length; j++) {
          resSt.push(
            <Grid key={j} item xs={12}>
              <Box sx={!itsme ? styleUserText : styleMeText}>{mass[j]}</Box>
            </Grid>,
          );
        }
        return resSt;
      };

      resStr.push(
        <Grid key={i} item container xs={12}>
          <Grid item xs={12} sx={!itsme ? styleUserUser : styleMeUser}>
            <b>{props.messages[i].user.name}</b>&nbsp;&nbsp;
            <em>
              {dat}&nbsp;{tim}
            </em>
          </Grid>
          {MassMessages()}
          {/* <Grid item xs={12}>
            <Box sx={!itsme ? styleUserText : styleMeText}>{mass[0]}</Box>
          </Grid> */}
        </Grid>,
      );
    }
    return resStr;
  };

  return <Box sx={styleMess01}>{StrMessages()}</Box>;
};

export default Messages;
