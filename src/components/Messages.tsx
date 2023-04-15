import React from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { MesssgeLength, Splitter } from './ChatServiceFunctions';

import { styleMess01, styleMeUser } from './ComponentsStyle';
import { styleMePict, styleUserPict } from './ComponentsStyle';
import { styleModalEnd, styleDelete } from './ComponentsStyle';

let resStr: any = [];
let picture: any = null;
let imageWidth = 0;
let imageHeight = 0;
let overFlow = 'auto';
//let ch = 0;

const Messages = (props: {
  messages: any;
  name: string;
  basket: any;
  PICT: any;
  funcDel: Function;
}) => {
  //console.log('1Пришло:', props.messages, props.PICT);
  let FuncDel = props.funcDel;
  // const Ch = () => {
  //   ch++;
  //   //console.log('Ch:', ch);
  // };

  const [openSetMode, setOpenSetMode] = React.useState(false);

  const handleCloseSetEnd = () => {
    setOpenSetMode(false);
  };

  const handleClickPict = React.useCallback(
    (idx: number) => {
      let tim = props.messages[idx].date;
      for (let i = 0; i < props.PICT.length; i++)
        if (props.PICT[i].time === tim) picture = props.PICT[i].message;
      let image = new Image();
      image.src = picture;
      setTimeout(() => {
        //console.log('!!!', idx, image.width, image.height);
        imageWidth = window.screen.width - 169;
        //let proporsia = image.width / imageWidth;
        if (image.width < imageWidth) imageWidth = image.width;
        imageHeight = window.screen.height - 177;
        overFlow = 'auto';
        if (image.height < imageHeight) {
          imageHeight = image.height;
          overFlow = 'hidden';
        }
        setOpenSetMode(true);
      }, 200);
    },
    [props.messages, props.PICT],
  );

  const styleSetSelect = {
    outline: 'none',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: imageWidth + 20,
    height: imageHeight + 2,
    bgcolor: 'background.paper',
    p: 0.3,
  };

  const styleModalOverflow = {
    overflowY: overFlow, //hidden auto
    width: imageWidth,
    height: imageHeight - 2,
  };

  const StrMessages = React.useCallback(() => {
    resStr = [];
    for (let i = 0; i < props.messages.length; i++) {
      let itsme = false;
      let pict = false;
      if (props.messages[i].user.name.trim().toLowerCase() === props.name.trim().toLowerCase())
        itsme = true;
      let coler = 'black';
      if (!itsme && props.messages[i].user.name === 'ChatAdmin') coler = 'blue';
      let dlina = MesssgeLength(props.messages[i].message, 13.5) + 14;
      let mass: string[] = [props.messages[i].message];
      if (props.messages[i].message.length > 50) {
        if (props.messages[i].message.slice(0, 11) === 'data:image/') {
          pict = true;
          //Ch();
        } else {
          mass = Splitter(props.messages[i].message, 69);
          dlina = 0;
          for (let j = 0; j < mass.length; j++) {
            let dl = MesssgeLength(mass[j], 13.5) + 10;
            if (dl > dlina) dlina = dl;
          }
        }
      }

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
        let resSt: any = [];
        for (let j = 0; j < mass.length; j++) {
          let mb = 1;
          let mt = 0.3;
          let bs = 2;
          let ht = 27;
          let btlr = 9;
          let btrr = 9;
          let bblr = 9;
          let bbrr = 9;
          if (mass.length > 1 && j < mass.length - 1) mb = 0;
          if (j === 0 && mass.length > 1) {
            bs = 0;
          } else {
            btlr = 0;
            btrr = 0;
          }
          if (j > 0 && j < mass.length - 1) {
            mt = 0;
            bs = 0;
          }
          if (j === mass.length - 1 && mass.length > 1) {
            mt = 0;
            ht = 27;
          } else {
            bblr = 0;
            bbrr = 0;
            if (mass.length > 1) ht = 21;
          }
          if (mass.length === 1) {
            bblr = 9;
            bbrr = 9;
            btlr = 9;
            btrr = 9;
          }

          if (!itsme) btlr = 0;
          if (itsme) btrr = 0;

          const styleMeText = {
            width: dlina,
            border: 2,
            height: ht,
            fontSize: '13.5px',
            background: '#93E5EE', //зелёный
            borderColor: '#93E5EE',
            color: 'black',
            marginTop: mt,
            padding: '3px 0px 0 6px',
            marginLeft: 'auto',
            marginRight: 0.4,
            marginBottom: mb,
            boxShadow: bs,
            borderTopLeftRadius: btlr,
            borderTopRightRadius: btrr,
            borderBottomLeftRadius: bblr,
            borderBottomRightRadius: bbrr,
          };

          const styleUserText = {
            width: dlina,
            border: 2,
            height: ht,
            fontSize: '13.5px',
            background: '#fafac3', // жёлтый
            borderColor: '#fafac3',
            color: coler,
            marginTop: mt,
            padding: '2px 0px 0 6px',
            marginBottom: mb,
            boxShadow: bs,
            borderTopLeftRadius: btlr,
            borderTopRightRadius: btrr,
            borderBottomLeftRadius: bblr,
            borderBottomRightRadius: bbrr,
          };

          resSt.push(
            <Grid key={j} item xs={12} sx={{ border: 0 }}>
              {!pict && <Box sx={!itsme ? styleUserText : styleMeText}>{mass[j]}</Box>}
              {pict && (
                <Box sx={!itsme ? styleUserPict : styleMePict}>
                  <img
                    src={props.messages[i].message}
                    style={{ float: itsme ? 'right' : 'left' }}
                    alt="PICT"
                    width="77%"
                    onClick={() => handleClickPict(i)}
                  />
                </Box>
              )}
            </Grid>,
          );
        }
        return resSt;
      };

      const handleDel = (num: number) => {
        FuncDel(props.messages[num].date);
      };

      resStr.push(
        <Grid key={i} item container xs={12}>
          <Grid item xs={12} sx={!itsme ? styleUserUser : styleMeUser}>
            <b>{props.messages[i].user.name}</b>&nbsp;&nbsp;
            <em>
              {dat}&nbsp;{tim}&nbsp;&nbsp;
            </em>
            {itsme && (
              <Button sx={styleDelete} onClick={() => handleDel(i)}>
                ❌
              </Button>
            )}
          </Grid>
          {MassMessages()}
        </Grid>,
      );
    }
    return resStr;
  }, [props.messages, props.name, handleClickPict]);

  React.useMemo(() => {
    console.log('MeMo');
    //console.log('2Пришло:', props.messages, props.PICT);
    StrMessages();
  }, [StrMessages]);

  return (
    <>
      <Box sx={styleMess01}>{resStr}</Box>
      <Modal open={openSetMode} onClose={handleCloseSetEnd}>
        <Box sx={styleSetSelect}>
          <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
            <b>&#10006;</b>
          </Button>
          <Box sx={styleModalOverflow}>
            <img src={picture} alt="PICT" />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Messages;
