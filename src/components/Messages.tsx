import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { styleMess01, styleMeUser, styleUserUser } from "./ComponentsStyle";

let resStr: any = [];

const Messages = (props: { messages: any; name: string }) => {
  const MesssgeLength = (text: string, fontSize: number) => {
    function textWidth(text: string, fontProp: any) {
      let tag = document.createElement("div");
      tag.style.position = "absolute";
      tag.style.left = "-999em";
      tag.style.whiteSpace = "nowrap";
      tag.style.font = fontProp;
      tag.innerHTML = text;
      document.body.appendChild(tag);
      let result = tag.clientWidth;
      document.body.removeChild(tag);
      return result;
    }

    let theCSSprop = window
      .getComputedStyle(document.body, null)
      .getPropertyValue("font-family");
    let bb = "bold " + fontSize + "px " + theCSSprop;
    // let aa = textWidth('🐷 🐷', 'bold 13px Segoe UI');
    // console.log('AA:', aa);
    return textWidth(text, bb);
  };

  const StrMessages = () => {
    resStr = [];
    for (let i = 0; i < props.messages.length; i++) {
      let itsme = false;
      if (
        props.messages[i].user.name.trim().toLowerCase() ===
        props.name.trim().toLowerCase()
      )
        itsme = true;

      let dlina = MesssgeLength(props.messages[i].message, 14) + 14;

      const styleMeText = {
        width: dlina,
        border: 2,
        height: "36px",
        fontSize: "14px",
        background: "#fafac3", // жёлтый
        borderColor: "#fafac3",
        borderRadius: 3,
        color: "black",
        marginTop: 0.3,
        padding: "6px 0px 6px 6px",
        marginLeft: "auto",
        marginBottom: 1,
      };

      const styleUserText = {
        width: dlina,
        border: 2,
        height: "36px",
        fontSize: "14px",
        background: "#93E5EE", //зелёный
        borderColor: "#93E5EE",
        borderRadius: 3,
        color: "black",
        marginTop: 0.3,
        padding: "6px 0px 6px 6px",
        marginBottom: 1,
      };

      let styleUser: any = styleMeUser;
      if (!itsme) styleUser = styleUserUser;
      let styleText: any = styleMeText;
      if (!itsme) styleText = styleUserText;
      let dat = "";
      if (
        new Date(props.messages[i].date).toLocaleDateString() !==
        new Date().toLocaleDateString()
      )
        dat = new Date(props.messages[i].date).toLocaleDateString();
      let tim = new Date(props.messages[i].date)
        .toLocaleTimeString()
        .slice(0, -3);

      resStr.push(
        <Grid key={i} item container xs={12}>
          <Grid item xs={12} sx={styleUser}>
            <b>{props.messages[i].user.name}</b>&nbsp;&nbsp;
            <em>
              {dat}&nbsp;{tim}
            </em>
          </Grid>
          <Grid item xs={12}>
            <Box sx={styleText}>{props.messages[i].message}</Box>
          </Grid>
        </Grid>
      );
    }

    return resStr;
  };

  return <Box sx={styleMess01}>{StrMessages()}</Box>;
};

export default Messages;
