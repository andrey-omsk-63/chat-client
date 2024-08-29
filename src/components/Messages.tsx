import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { MesssgeLength, Splitter } from "./ChatServiceFunctions";

import { styleMess01, styleMeUser, styleMeSay } from "./ComponentsStyle";
import { styleMePict, styleUserPict, styleUserSay } from "./ComponentsStyle";
import { styleDelete } from "./ComponentsStyle";

let resStr: any = [];
let picture: any = null;
let imageWidth = 0;
let imageHeight = 0;
let overFlow = "auto";
//let ch = 0;

const Messages = (props: {
  messages: any;
  name: string;
  basket: any;
  PICT: any;
  funcDel: Function;
}) => {
  let FuncDel = props.funcDel;

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
        imageWidth = window.screen.width - 169;
        if (image.width < imageWidth) imageWidth = image.width;
        imageHeight = window.screen.height - 177;
        overFlow = "auto";
        if (image.height < imageHeight) {
          imageHeight = image.height;
          overFlow = "hidden";
        }
        setOpenSetMode(true);
      }, 200);
    },
    [props.messages, props.PICT]
  );

  const styleSetSelect = {
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: imageWidth + 20,
    height: imageHeight + 2,
    bgcolor: "background.paper",
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
      if (
        props.messages[i].user.name.trim().toLowerCase() ===
        props.name.trim().toLowerCase()
      )
        itsme = true;
      let coler = "black";
      if (!itsme && props.messages[i].user.name === "ChatAdmin") coler = "blue";
      let dlina = MesssgeLength(props.messages[i].message, 13.5) + 14;
      let mass: string[] = [props.messages[i].message];
      if (props.messages[i].message.length > 50) {
        if (props.messages[i].message.slice(0, 11) === "data:image/") {
          pict = true;
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
        fontSize: "11.5px",
        color: coler,
        paddingLeft: "9px",
        textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
      };

      let dat =
        new Date(props.messages[i].date).toLocaleDateString() !==
        new Date().toLocaleDateString()
          ? new Date(props.messages[i].date).toLocaleDateString()
          : "";
      let tim = new Date(props.messages[i].date)
        .toLocaleTimeString()
        .slice(0, -3);

      const MassMessages = () => {
        let resSt: any = [];
        for (let j = 0; j < mass.length; j++) {
          let mb = 1;
          let mt = -2.15;
          let bs = "2px 4px 4px 1px #8BA27D";
          let ht = 27;
          let btlr = 6;
          let btrr = 6;
          let bblr = 6;
          let bbrr = 6;
          if (mass.length > 1 && j < mass.length - 1) mb = 0;
          if (j === 0 && mass.length > 1) {
            //bs = 0;
          } else {
            btlr = 0;
            btrr = 0;
          }
          if (j > 0 && j < mass.length - 1) mt = 0;
          if (j === mass.length - 1 && mass.length > 1) {
            mt = 0;
            ht = 27;
          } else {
            bblr = 0;
            bbrr = 0;
            if (mass.length > 1) ht = 21;
          }
          if (mass.length === 1) {
            bblr = 6;
            bbrr = 6;
            btlr = 6;
            btrr = 6;
          }
          if (!itsme) btlr = 0;
          if (itsme) btrr = 0;

          const styleMeText = {
            width: dlina,
            border: 2,
            height: ht,
            fontSize: "13.5px",
            background: "#93E5EE", //голубой
            borderColor: "#93E5EE",
            color: "black",
            marginTop: mt,
            padding: "3px 0px 0 6px",
            marginLeft: "auto",
            marginRight: 1,
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
            fontSize: "13.5px",
            background: "#fafac3", // жёлтый
            borderColor: "#fafac3",
            color: coler,
            marginTop: mt,
            marginLeft: 1,
            padding: "2px 0px 0 6px",
            marginBottom: mb,
            boxShadow: bs,
            borderTopLeftRadius: btlr,
            borderTopRightRadius: btrr,
            borderBottomLeftRadius: bblr,
            borderBottomRightRadius: bbrr,
          };

          resSt.push(
            <Grid key={j} item xs={12} sx={{ border: 0 }}>
              {!pict && (
                <>
                  {!j && <Box sx={!itsme ? styleUserSay : styleMeSay}>▼</Box>}
                  <Box sx={!itsme ? styleUserText : styleMeText}>{mass[j]}</Box>
                </>
              )}
              {pict && (
                <Box sx={!itsme ? styleUserPict : styleMePict}>
                  <img
                    src={props.messages[i].message}
                    style={{
                      boxShadow: "4px 4px 10px 2px #738567",
                      float: itsme ? "right" : "left",
                    }}
                    alt="PICT"
                    onClick={() => handleClickPict(i)}
                  />
                </Box>
              )}
            </Grid>
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
        </Grid>
      );
    }
    return resStr;
  }, [props.messages, props.name, handleClickPict]);

  React.useMemo(() => {
    console.log("MeMo");
    //console.log('2Пришло:', props.messages, props.PICT);
    StrMessages();
  }, [StrMessages]);

  let sdvig = "-0px";
  if (imageWidth > 1000) sdvig = "-5px";
  if (imageWidth > 1400) sdvig = "-9px";

  const styleModalEnd = {
    position: "absolute",
    top: "0%",
    left: "auto",
    right: sdvig,
    height: "21px",
    maxWidth: "2%",
    minWidth: "2%",
    color: "black",
  };

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
