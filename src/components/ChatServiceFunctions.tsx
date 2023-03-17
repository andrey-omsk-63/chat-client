import * as React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { styleChatInp01, styleChatInp02 } from "./ComponentsStyle";
import { styleChat021, styleChat022 } from "./ComponentsStyle";
import { styleChatInp03, styleChat041 } from "./ComponentsStyle";
import { styleChat08 } from "./ComponentsStyle";

export const MakeSpisUsers = (mass: any) => {
  let sistUsers: Array<any> = [];
  let onLine: number = 0;
  for (let i = 0; i < mass.length; i++) {
    let idd = (i + 1).toString();
    if (i + 1 < 10) idd = "0" + idd;
    let mask = {
      user: mass[i].user,
      id: idd,
      status: mass[i].status,
    };
    if (mass[i].status === "online") onLine++;
    sistUsers.push(mask);
  }
  return [sistUsers, onLine];
};

const handleKey = (event: any) => {
  if (event.key === "Enter") event.preventDefault();
};

export const InputerMessage = (message: string, handleChange: any) => {
  return (
    <Box sx={styleChatInp01}>
      <TextField
        size="small"
        onKeyPress={handleKey} //отключение Enter
        placeholder="👇️Что вы хотите сказать?"
        InputProps={{
          disableUnderline: true,
          style: styleChatInp02,
        }}
        value={message}
        onChange={handleChange}
        variant="standard"
      />
    </Box>
  );
};

export const SendMessage = (handleSubmit: any) => {
  return (
    <Box sx={styleChatInp03}>
      <Button sx={styleChat041} onClick={handleSubmit}>
        Отправить сообщение
      </Button>
    </Box>
  );
};

export const HeaderChat = (chatRoom: string) => {
  return (
    <Grid container sx={styleChat021}>
      <Grid item xs={12} sx={styleChat022}>
        Пользователи в<Box>{chatRoom}</Box>
      </Grid>
    </Grid>
  );
};

export const HeaderSist = () => {
  return (
    <Grid container sx={styleChat021}>
      <Grid item xs={12} sx={styleChat022}>
        Пользователи в<Box>системе:</Box>
      </Grid>
    </Grid>
  );
};

export const UsersChat = (usersRooms: any) => {
  let resStr: any = [];
  for (let i = 0; i < usersRooms.length; i++) {
    let nameer = usersRooms[i].name;
    if (nameer.length > 15) nameer = nameer.slice(0, 15);
    resStr.push(
      <Grid key={i} container>
        <Grid item xs={12} sx={styleChat08}>
          <b>{nameer}</b>
        </Grid>
      </Grid>
    );
  }
  return resStr;
};

export const SendSocketSendMessage = (
  ws: WebSocket,
  message: string,
  otKogo: string,
  nameKomu: string
) => {
  console.log("SendMessage:", message, otKogo, nameKomu);
  const handleSendOpen = () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "message",
          from: otKogo,
          message: message,
          time: new Date().toISOString(),
          to: nameKomu,
        })
      );
    } else {
      setTimeout(() => {
        handleSendOpen();
      }, 1000);
    }
  };
  handleSendOpen();
};
