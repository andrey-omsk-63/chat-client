import * as React from "react";
import { Buffer } from "buffer";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EmojiPicker from "emoji-picker-react";

import { styleChatInp01, styleChatInp02 } from "./ComponentsStyle";
import { styleChat021, styleChat022 } from "./ComponentsStyle";
import { styleChatInp03, styleChat041 } from "./ComponentsStyle";
import { styleChat06, styleChat061, styleChat07 } from "./ComponentsStyle";
import { styleChat08, styleChat081, styleChatBut021 } from "./ComponentsStyle";
import { styleChatBut01, styleChatBut02 } from "./ComponentsStyle";

//=== Chat =========================================
export const isNumeric = (n: number) => !isNaN(n);

export const Scrooler = (divRef: any) => {
  setTimeout(() => {
    // 👇️ scroll to bottom every time messages change
    divRef.current && divRef.current.scrollIntoView();
  }, 150);
};

export const b64toBlob = (
  b64Data: any,
  contentType: any,
  sliceSize: number
) => {
  contentType = contentType || "";
  sliceSize = sliceSize || 256;
  let byteCharacters1 = Buffer.from(b64Data, "base64");
  let byteCharacters2 = byteCharacters1.toString("base64");
  //let byteCharacters = atob(b64Data);
  let byteCharacters = atob(byteCharacters2);
  //console.log('0:',byteCharacters)
  //console.log('1:',byteCharacters1)
  //console.log('2:',byteCharacters2)
  let byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize);
    let byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  let blob = new Blob(byteArrays, { type: contentType });
  console.log("3:", blob);
  return blob;
};

export const MakeNewBlob = (MESS: string) => {
  let poz = MESS.indexOf(",");
  let sblob = MESS.slice(poz + 1);
  let contentType = "image/png";
  let blob: any = b64toBlob(sblob, contentType, 256);
  return blob;
};

export const Pipip = () => {
  function beep() {
    let snd = new Audio(
      "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
    );
    snd.play();
  }
  beep();
};

export const MakeOldDate = (dt: string, cutDays: number) => {
  let date = new Date(dt);
  date.setDate(date.getDate() - cutDays);
  return date.toISOString();
};

export const MakeSpisUsers = (mass: any) => {
  let sistUsers: Array<any> = [];
  let onLine: number = 0;
  for (let i = 0; i < mass.length; i++) {
    let idd = (i + 1).toString();
    if (i + 1 < 10) idd = "0" + idd;
    if (mass[i].status === "online") onLine++;
    sistUsers.push({
      user: mass[i].user,
      id: idd,
      status: mass[i].status,
    });
  }
  return [sistUsers, onLine];
};

export const InputerMessage = (
  message: string,
  handleChange: any,
  handleSubmit: any
) => {
  const handleKey = (event: any) => {
    event.key === "Enter" && handleSubmit();
  };

  return (
    <Box sx={styleChatInp01}>
      <TextField
        size="small"
        onKeyPress={handleKey}
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
      <Button sx={styleChat041} onClick={() => handleSubmit()}>
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

export const HeaderChel = (users: number, chel: string, nameRoom: string) => {
  return (
    <Box sx={{ fontSize: 12.9 }}>
      <b>
        {users} {chel} {nameRoom}
      </b>
    </Box>
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

export const DebugRigtPartChat = (paramsRoom: string, usersRooms: string) => {
  return (
    <>
      {HeaderChat(paramsRoom !== "Global" ? "комнате:" : "чате:")}
      <Box sx={{ overflowX: "auto", height: "7vh" }}>
        {UsersChat(usersRooms)}
      </Box>
    </>
  );
};

export const UsersSist = (
  sistUsers: any,
  archive: any,
  paramsName: string,
  nameKomu: string,
  ClickKnop: Function
) => {
  let resStr: any = [];
  for (let i = 0; i < sistUsers.length; i++) {
    let nameer = sistUsers[i].user;
    if (nameer.length > 15) nameer = nameer.slice(0, 15);
    let coler = sistUsers[i].status !== "online" ? "black" : "blue";
    let point = " ";
    for (let j = 0; j < archive.length; j++) {
      if (
        archive[j].from !== "ChatAdmin" &&
        archive[j].from !== paramsName &&
        archive[j].from === sistUsers[i].user
      ) {
        if (
          archive[j].to !== "Global" &&
          archive[j].to === paramsName &&
          !archive[j].read
        )
          point = "●";
      }
    }

    const styleChatBut01 = {
      fontSize: 12,
      border: "1px solid #000",
      bgcolor: "#E6F5D6", // светло салатовый
      width: "105px",
      height: "20px",
      borderColor: "#d4d4d4", // серый
      borderRadius: 1,
      color: coler,
      boxShadow: 4,
      textTransform: "unset !important",
    };

    resStr.push(
      <Grid key={i} container>
        <Grid item xs={0.7} sx={styleChat081}>
          {point}
        </Grid>
        <Grid item xs sx={styleChat08}>
          <Box sx={{ color: coler }}>
            {sistUsers[i].user !== paramsName &&
              sistUsers[i].user !== nameKomu && (
                <Button sx={styleChatBut01} onClick={() => ClickKnop(i)}>
                  {sistUsers[i].status !== "online" && <em>{nameer}</em>}
                  {sistUsers[i].status === "online" && <b>{nameer}</b>}
                </Button>
              )}
            {sistUsers[i].user === paramsName && (
              <Box sx={{ padding: "0.5vh 0 0 0" }}>
                <b>{nameer}</b>
              </Box>
            )}
            {sistUsers[i].user === nameKomu && (
              <Box sx={{ padding: "0.5vh 0 0 0" }}>
                {sistUsers[i].status !== "online" && <em>{nameer}</em>}
                {sistUsers[i].status === "online" && <b>{nameer}</b>}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  }
  return <Box sx={{ overflowX: "auto", height: "69.25vh" }}>{resStr}</Box>;
};

export const ChatServisKnop = (
  metka: boolean,
  turnOn: boolean,
  scRef: any,
  paramsRoom: string,
  maxPosition: number,
  GoToBottom: Function,
  TurnOn: Function
) => {
  let pointt = metka ? "●" : " ";
  let sound = turnOn ? "🔇 Выкл" : "🔊 Вкл";
  let illum = !turnOn ? styleChatBut021 : styleChatBut02;
  let poz = scRef.current ? scRef.current.scrollTop : 0;
  return (
    <Grid container sx={{ border: 0, height: "9.5vh" }}>
      <Grid item xs={0.8} sx={styleChat081}>
        {pointt}
      </Grid>
      <Grid item xs={3} sx={{ border: 0 }}>
        {paramsRoom === "Global" && maxPosition !== poz && (
          <Button sx={styleChatBut01} onClick={() => GoToBottom()}>
            🔽
          </Button>
        )}
      </Grid>
      <Grid item xs sx={{ border: 0 }}>
        <Button sx={illum} onClick={() => TurnOn()}>
          {sound}
        </Button>
      </Grid>
    </Grid>
  );
};

export const ChatEmojiPicker = (
  isOpen: boolean,
  setOpen: Function,
  onEmojiClick: Function
) => {
  return (
    <Box sx={styleChat06}>
      <Button sx={styleChat061} onClick={() => setOpen(!isOpen)}>
        😎
      </Button>
      {isOpen && (
        <Box sx={styleChat07}>
          <EmojiPicker onEmojiClick={(e) => onEmojiClick(e)} />
        </Box>
      )}
    </Box>
  );
};

export const SendSocketSendMessage = (
  ws: WebSocket,
  message: any,
  otKogo: string,
  nameKomu: string
) => {
  //console.log("SendMessage:", message, otKogo, nameKomu);
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

export const SendSocketDeleteMessage = (
  ws: WebSocket,
  message: any,
  otKogo: string,
  nameKomu: string,
  timeMewss: any
) => {
  console.log("SendSocketDeleteMessage:", otKogo, nameKomu);
  const handleSendOpen = () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "delete",
          from: otKogo,
          message: message,
          time: timeMewss,
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

export const SendSocketHistory = (
  ws: WebSocket,
  dStart: string,
  dEnd: string
) => {
  console.log("SendHistory:", dStart, dEnd);
  const handleSendOpen = () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "history",
          data: {
            timeEnd: dEnd,
            timeStart: dStart,
          },
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

export const SendSocketMarkAsRead = (
  ws: WebSocket,
  otKogo: string,
  nameKomu: string,
  mess: string,
  timeMess: string
) => {
  console.log("SendMarkAsRead:", otKogo, nameKomu, timeMess);
  const handleSendOpen = () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "markAsRead",
          from: otKogo,
          message: mess,
          time: timeMess,
          to: nameKomu,
          read: true,
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

//=== Messages =====================================
export const MesssgeLength = (text: string, fontSize: number) => {
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
  // let aa = textWidth('🐷🤡🐷', 'bold 13px Segoe UI');
  // console.log('AA:', aa);
  return textWidth(text, bb);
};

export const Splitter = (str: string, l: number) => {
  let strs = [];
  while (str.length > l) {
    let pos = str.substring(0, l).lastIndexOf(" ");
    pos = pos <= 0 ? l : pos;
    strs.push(str.substring(0, pos));
    let i = str.indexOf(" ", pos) + 1;
    if (i < pos || i > pos + l) i = pos;
    str = str.substring(i);
  }
  strs.push(str);
  return strs;
};
//==================================================
//https://stackoverflow.com/questions/73659207/react-js-upload-image-wh
//en-user-pastes-an-image
// document.onpaste = function (event: any) {
//   let items = (event.clipboardData || event.originalEvent.clipboardData).items;
//   console.log(JSON.stringify(items)); // может дать вам типы пантомимы
//   for (let index in items) {
//     let item = items[index];
//     if (item.kind === "file") {
//       let blob = item.getAsFile();
//       let reader = new FileReader();
//       reader.onload = function (event: any) {
//         console.log(event.target.result); // data url! };
//         reader.readAsDataURL(blob);
//       };
//     }
//   }
// };
// let image = new Image();
// image.src = "data:image/png;base64,iVBORw0K...";
// document.body.appendChild(image);
// image.width
// image.height
//---------------------------
// function b64toBlob(b64Data: any, contentType: any, sliceSize: any) {
//   contentType = contentType || '';
//   sliceSize = sliceSize || 512;
//   var byteCharacters = atob(b64Data);
//   var byteArrays = [];
//   for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//     var slice = byteCharacters.slice(offset, offset + sliceSize);
//     var byteNumbers = new Array(slice.length);
//     for (var i = 0; i < slice.length; i++) {
//       byteNumbers[i] = slice.charCodeAt(i);
//     }
//     var byteArray = new Uint8Array(byteNumbers);
//     byteArrays.push(byteArray);
//   }
//   var blob = new Blob(byteArrays, {type: contentType});
//   return blob;
// };
//---------------------------
