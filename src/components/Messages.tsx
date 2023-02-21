import React from "react";

import Box from "@mui/material/Box";

import styles from "../styles/Messages.module.css";

import { styleMess01, styleMeUser, styleUserUser } from "./ComponentsStyle";
import { styleMeText, styleUserText } from "./ComponentsStyle";

let resStr: any = [];

const Messages = (props: { messages: any; name: string }) => {
  console.log("props:", props);

  const StrMessages = () => {
    resStr = [];
    for (let i = 0; i < props.messages.length; i++) {
      let itsme = false;
      if (
        props.messages[i].user.name.trim().toLowerCase() ===
        props.name.trim().toLowerCase()
      )
        itsme = true;
      let styleUser: any = styleMeUser;
      if (itsme) styleUser = styleUserUser;
      let styleText: any = styleMeText;
      if (itsme) styleText = styleUserText;
  
      resStr.push(
        <>
          <Box sx={styleUser}>{props.messages[i].user.name}</Box>
          <Box sx={styleText}>{props.messages[i].message}</Box>
        </>,
      );
    }
    console.log("###1", props.messages[0]);
    console.log("###2", props.name);
    return resStr;
  }
  StrMessages()
  return (
    // <div className={styles.messages}>
    <Box sx={styleMess01}>
      {/* {StrMessages()} */}
      {resStr}
      {/* {props.messages.map((param: any, i: number) => {
        const itsMe =
          param.user.name.trim().toLowerCase() ===
          props.name.trim().toLowerCase();
        const className = itsMe ? styles.me : styles.user;

        return (
          <div key={i} className={`${styles.message} ${className}`}>
            <>
              <span className={styles.user}>{param.user.name}</span>

              <div className={styles.text}>{param.message}</div>

            </>
          </div>
        );
      })} */}
    </Box>
    // </div>
  );
};

export default Messages;
