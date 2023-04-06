import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { MesssgeLength, Splitter } from "./ChatServiceFunctions";

import { styleMess01, styleMeUser } from "./ComponentsStyle";
import { styleMePict, styleUserPict } from "./ComponentsStyle";

let resStr: any = [];
let picture: any = null;

//let ch = 0;

const Messages = (props: { messages: any; name: string; basket: any }) => {
  // const Ch = () => {
  //   ch++;
  //   console.log("Ch:", ch);
  // };

  const [openSetMode, setOpenSetMode] = React.useState(false);
  const scRef: any = React.useRef(null);
  //const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const handleCloseSetEnd = () => {
    setOpenSetMode(false);
  };

  const handleClickPict = React.useCallback((pict: any) => {
    let scr = 0;
    if (scRef.current) scr = scRef.current.getBoundingClientRect();
    console.log("Пришло handleClickPict", scr);
    picture = pict;
    setOpenSetMode(true);
  }, []);

  const styleSetSelect = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    //======
    width: window.screen.width - 500,
    height: window.screen.height - 212,
    bgcolor: "background.paper",
    //p: 1.5,
  };

  const styleModalEnd = {
    position: "absolute",
    top: "0%",
    left: "auto",
    right: "-0%",
    height: "21px",
    maxWidth: "2%",
    minWidth: "2%",
    color: "black",
  };

  const StrMessages = React.useCallback(() => {
    //console.log("Пришло:", props.messages);
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
        if (
          props.messages[i].message.slice(0, 21) === "data:image/png;base64"
        ) {
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
        fontSize: "11.5px",
        color: coler,
        paddingLeft: "9px",
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
        let resSt = [];
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
            fontSize: "13.5px",
            background: "#93E5EE", //зелёный
            borderColor: "#93E5EE",
            color: "black",
            marginTop: mt,
            padding: "3px 0px 0 6px",
            marginLeft: "auto",
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
            fontSize: "13.5px",
            background: "#fafac3", // жёлтый
            borderColor: "#fafac3",
            color: coler,
            marginTop: mt,
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
                <Box sx={!itsme ? styleUserText : styleMeText}>{mass[j]}</Box>
              )}
              {pict && (
                <Box sx={!itsme ? styleUserPict : styleMePict}>
                  <img
                    src={props.messages[i].message}
                    style={{
                      width: "77%",
                      height: "100%",
                      float: itsme ? "right" : "left",
                    }}
                    alt="PICT"
                    onClick={() => handleClickPict(props.messages[i].message)}
                  />
                </Box>
              )}
            </Grid>
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
        </Grid>
      );
    }
    return resStr;
  }, [props.messages, props.name, handleClickPict]);

  React.useMemo(() => {
    StrMessages();
  }, [StrMessages]);

  // React.useLayoutEffect(() => {
  //   if (scRef.current) {
  //     setDimensions({
  //       width: scRef.current.offsetWidth,
  //       height: scRef.current.offsetHeight,
  //     });
  //   }
  // }, []);

  return (
    <>
      <Box sx={styleMess01}>{resStr}</Box>
      <Modal ref={scRef} open={openSetMode} onClose={handleCloseSetEnd}>
        <Box sx={styleSetSelect}>
          <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
            <b>&#10006;</b>
          </Button>
          <img
            src={picture}
            style={{
              width: "77%",
              height: "100%",
            }}
            alt="PICT"
          />
        </Box>
      </Modal>
    </>
  );
};

export default Messages;
