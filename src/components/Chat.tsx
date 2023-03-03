import React from "react";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import axios from "axios";

import icon from "../images/emoji.svg";
import Messages from "./Messages";

import { MakeSpisUsers } from "./ChatServiceFunctions";

import { styleChat01, styleChat02, styleChat08 } from "./ComponentsStyle";
import { styleChat021, styleChat022 } from "./ComponentsStyle";
import { styleChat03, styleChat04, styleChat16 } from "./ComponentsStyle";
import { styleChat05, styleChat06, styleChat07 } from "./ComponentsStyle";
import { styleChatInp01, styleChatInp02 } from "./ComponentsStyle";
import { styleChatInp03, styleChat041 } from "./ComponentsStyle";
import { styleChatBut01, styleChat081 } from "./ComponentsStyle";

const ioo: any = io;
const socket = ioo.connect("http://localhost:5000");

let usersRooms: any = [];
let debug = false;
let flagOpenDebug = true;
let chatReady = 0;
let oldName = "oldName";
let oldRoom = "oldRoom";
let nameKomu = "Global";

let archive: any = [];
let sistUsers: Array<any> = [];
let maskSoob = {
  user: {
    name: "ChatAdmin",
  },
  message: "123, и снова здравствуйте",
  date: new Date(),
};

const Chat = (props: { ws: WebSocket; nik: any }) => {
  const [params, setParams] = React.useState({ room: "", user: "" } as any);
  const [state, setState] = React.useState<Array<any>>([]);
  const [message, setMessage] = React.useState("");
  const [isOpen, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState(0);
  //const [sistUsers, setSistUsers] = React.useState<Array<any>>([]);
  //const [trigger, setTrigger] = React.useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();
  const divRef: any = React.useRef(null);

  let WS = props.ws;
  if (WS.url.slice(0, 21) === "wss://localhost:3000/") debug = true;
  //console.log('props:', props, params);

  const PostingArchive = React.useCallback((archive: any, room: string) => {
    console.log("PostingArchive", room, archive);
    for (let i = 0; i < archive.messages.length; i++) {
      if (
        //archive.messages[i].from === room ||
        archive.messages[i].to === room
      ) {
        maskSoob.user.name = archive.messages[i].from;
        maskSoob.message = archive.messages[i].message;
        maskSoob.date = archive.messages[i].time;
        let mass = JSON.parse(JSON.stringify(maskSoob));
        setState((_state) => [..._state, mass]);
      }
    }
  }, []);

  //=== инициализация ======================================
  if (debug && flagOpenDebug) {
    console.log("РЕЖИМ ОТЛАДКИ!!!");
    let ipAdress = "http://localhost:3000/otladkaArchive.json";
    axios.get(ipAdress).then(({ data }) => {
      archive = data.data.archive;
      chatReady++;
      PostingArchive(data.data.archive, "Global");
    });
    ipAdress = "http://localhost:3000/otladkaUsers.json";
    axios.get(ipAdress).then(({ data }) => {
      sistUsers = MakeSpisUsers(data.data.users);
      console.log("sistUsers", sistUsers);
      chatReady++;
    });
    flagOpenDebug = false;
    console.log("1params:", archive, state);
  }

  //========================================================
  React.useEffect(() => {
    WS.onopen = function (event: any) {
      //console.log("WS.current.onopen:", event);
    };
    WS.onclose = function (event: any) {
      //console.log("WS.current.onclose:", event);
    };
    WS.onerror = function (event: any) {
      //console.log("WS.current.onerror:", event);
    };
    WS.onmessage = function (event: any) {
      let allData = JSON.parse(event.data);
      let data = allData.data;
      //console.log("пришло:", data.error, allData.type, data);
      switch (allData.type) {
        case "users":
          //setSistUsers(data.users);
          sistUsers = MakeSpisUsers(data.users);
          break;
        case "archive":
          archive = data.archive;
          PostingArchive(data.archive, "Global");
          break;
        case "getBindings":
          break;
        case "getAddObjects":
          break;
        case "getPhases":
          break;
        case "getSvg":
          break;
        default:
          console.log("data_default:", data);
      }
    };
  }, [WS, PostingArchive]);

  //window.localStorage.getItem("login")
  //=== РЕЖИМ ОТЛАДКИ ======================================
  React.useEffect(() => {
    const searchParams: any = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    console.log("3params:", searchParams, oldName, oldRoom);
    if (oldName !== "oldName" && oldRoom !== "oldRoom") {
      //console.log('4params:', searchParams, oldName, oldRoom);
      if (oldName !== searchParams.name || oldRoom !== searchParams.room) {
        console.log("2params:", archive);
        PostingArchive(archive, searchParams.room);
        oldName = searchParams.name;
        oldRoom = searchParams.room;
      }
    } else {
      oldName = searchParams.name;
      oldRoom = searchParams.room;
    }
    //console.log("4params:", oldName, oldRoom, state);
    socket.emit("join", searchParams);
    return () => {
      socket.off();
    };
  }, [search, PostingArchive]);

  const leftRoom = () => {
    if (params.room !== "Global") {
      nameKomu = "Global";
      let newParams = params;
      newParams.room = nameKomu;
      setParams(newParams);
      setState([]);
      PostingArchive(archive, nameKomu);
      oldName = newParams.name;
      oldRoom = nameKomu;
      console.log("Click2:", params, state);
      socket.emit("join", params, nameKomu);
      return () => {
        socket.off();
      };
    } else {
      socket.emit("leftRoom", { params });
      navigate("/");
    }
  };

  React.useEffect(() => {
    socket.on("message", (event: any) => {
      console.log("event.data:", event.data, "::", oldRoom, archive);
      let mask = {
        from: event.data.user.name,
        to: event.data.to,
        message: event.data.message,
        time: event.data.date,
        read: false,
      };
      console.log("ARH:", archive, archive.messages.length);
      if (archive.messages.length) {
        archive.messages.push(mask);
        console.log("HHHHandleSubmit", archive.messages);
      }
      setTimeout(() => {
        if (event.data.to === oldRoom) {
          setState((_state) => [..._state, event.data]);
        }
      }, 100);
      setTimeout(() => {
        // 👇️ scroll to bottom every time messages change
        divRef.current && divRef.current.scrollIntoView();
      }, 150);
    });
    socket.on("room", (event: any) => {
      setUsers(event.data.users.length);
      usersRooms = event.data.users;
      // 👇️ scroll to bottom every time messages change
      divRef.current && divRef.current.scrollIntoView();
    });
  }, []);
  //========================================================
  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    if (!message) return;
    let date = new Date().toISOString();
    socket.emit("sendMessage", { message, params, date, oldRoom });

    console.log("HandleSubmiT", message, params, date);

    setMessage("");
  };

  const onEmojiClick = (event: any) => setMessage(`${message} ${event.emoji}`);

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  let chel = "человек";
  if (users !== 12 && users !== 13 && users !== 14) {
    if (users % 10 === 2 || users % 10 === 3 || users % 10 === 4) chel += "а";
  }

  const LeftPartChat = () => {
    let nameRoom = " комнате";
    let redKnop = "Покинуть комнату";
    if (params.room === "Global") {
      nameRoom = " чате";
      redKnop = "Выйти из чата";
    }
    let roomName = nameKomu;
    if (nameKomu !== "Global") roomName = nameKomu + "/" + params.name;
    return (
      <>
        <Box sx={styleChat02}>
          {/* <Box sx={styleChat03}>{params.room}</Box> */}
          <Box sx={styleChat03}>{roomName}</Box>
          <Box>
            {users} {chel} {nameRoom}
          </Box>
          <Button sx={styleChat04} variant="contained" onClick={leftRoom}>
            {redKnop}
          </Button>
        </Box>

        <Box sx={styleChat05}>
          <Box sx={{ overflowX: "auto", height: "86vh" }}>
            <Messages messages={state} name={params.name} />
            <div ref={divRef} />
          </Box>
        </Box>

        <Box sx={styleChat16}>
          <Box sx={styleChatInp01}>
            <TextField
              size="small"
              onKeyPress={handleKey} //отключение Enter
              placeholder="Что вы хотите сказать?"
              InputProps={{
                disableUnderline: true,
                style: styleChatInp02,
              }}
              value={message}
              onChange={handleChange}
              variant="standard"
            />
          </Box>

          <Box sx={styleChat06}>
            <img src={icon} alt="" onClick={() => setOpen(!isOpen)} />
            {isOpen && (
              <Box sx={styleChat07}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </Box>
            )}
          </Box>

          <Box sx={styleChatInp03}>
            <Button sx={styleChat041} onClick={handleSubmit}>
              Отправить сообщение
            </Button>
          </Box>
        </Box>
      </>
    );
  };

  const UsersChat = () => {
    let resStr: any = [];
    for (let i = 0; i < usersRooms.length; i++) {
      let nameer = usersRooms[i].name;
      if (nameer.length > 15) nameer = nameer.slice(0, 15);
      resStr.push(
        <Grid key={i} item container xs={12}>
          <Grid item xs={12} sx={styleChat08}>
            <b>{nameer}</b>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  const ClickKnop = (mode: number) => {
    console.log("Click1:", sistUsers[mode], params, sistUsers);
    let newParams = params;
    let id1 = sistUsers[mode].id; // кому
    nameKomu = sistUsers[mode].user;
    let id2 = "00";
    for (let i = 0; i < sistUsers.length; i++) {
      if (sistUsers[i].user === params.name) id2 = sistUsers[i].id; // от кого
    }
    let roomer = id1 + id2;
    if (Number(id2) < Number(id1)) roomer = id2 + id1;
    newParams.room = roomer;
    setParams(newParams);
    setState([]);
    PostingArchive(archive, roomer);
    oldName = newParams.name;
    oldRoom = roomer;
    console.log("Click2:", params, state);
    socket.emit("join", params, roomer);
    return () => {
      socket.off();
    };
  };

  const UsersSist = () => {
    let resStr: any = [];
    //console.log("UsersSist:", nameKomu, params);
    for (let i = 0; i < sistUsers.length; i++) {
      let nameer = sistUsers[i].user;
      if (nameer.length > 15) nameer = nameer.slice(0, 15);
      resStr.push(
        <Grid key={i} item container xs={12}>
          <Grid item xs={0.5} sx={styleChat081}>
            •
          </Grid>
          <Grid item xs sx={styleChat08}>
            {sistUsers[i].user !== params.name &&
              sistUsers[i].user !== nameKomu && (
                <Button
                  variant="contained"
                  sx={styleChatBut01}
                  onClick={() => ClickKnop(i)}
                >
                  {sistUsers[i].status !== "online" && <em>{nameer}</em>}
                  {sistUsers[i].status === "online" && <b>{nameer}</b>}
                </Button>
              )}
            {sistUsers[i].user === params.name && (
              <Box sx={{ padding: "0.5vh 0 0 0" }}>
                <b>{nameer}</b>
              </Box>
            )}
            {sistUsers[i].user === nameKomu && (
              <Box sx={{ padding: "0.5vh 0 0 0" }}>
                <b>{nameer}</b>
              </Box>
            )}
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  //console.log("###:", chatReady, state);
  let chatRoom = "чате:";
  if (params.room !== "Global") chatRoom = "комнате:";
  return (
    <Grid container>
      <Grid item xs={10} sx={styleChat01}>
        {chatReady > 1 && <>{LeftPartChat()}</>}
      </Grid>

      <Grid item xs sx={styleChat01}>
        <Box sx={{ background: "#D3D3D3" }}>
          <Grid container sx={styleChat021}>
            <Grid item xs={12} sx={styleChat022}>
              Пользователи в<Box>{chatRoom}</Box>
            </Grid>
          </Grid>
          <Box sx={{ overflowX: "auto", height: "6vh" }}>{UsersChat()}</Box>
          <Grid container sx={styleChat021}>
            <Grid item xs={12} sx={styleChat022}>
              Пользователи в<Box>системе:</Box>
            </Grid>
          </Grid>
          <Box sx={{ overflowX: "auto", height: "79.5vh" }}>{UsersSist()}</Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Chat;
