import React from "react";
//import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Messages from "./Messages";

import { MakeSpisUsers, InputerMessage } from "./ChatServiceFunctions";
import { HeaderChat, HeaderSist, UsersChat } from "./ChatServiceFunctions";
import { SendMessage, SendSocketSendMessage } from "./ChatServiceFunctions";

import { styleChat01, styleChat02, styleChat08 } from "./ComponentsStyle";
import { styleChat03, styleChat04, styleChat16 } from "./ComponentsStyle";
import { styleChat05, styleChat06, styleChat07 } from "./ComponentsStyle";
import { styleChatBut01, styleChat081, styleChat061 } from "./ComponentsStyle";

import { dataArchive } from "./../otladkaArchive";
import { dataUsers } from "./../otladkaUsers";

let usersRooms: any = [];
let debug = false;
let flagOpenDebug = true;
let oldName = "oldName";
let oldRoom = "oldRoom";
let nameKomu = "Global";

let archive: any = [];
let sistUsers: any = [];
let maskSoob = {
  user: {
    name: "ChatAdmin",
  },
  message: "123, и снова здравствуйте",
  date: new Date(),
};

const Chat = (props: { ws: WebSocket; Socket: any; nik: any }) => {
  let socket = props.Socket;
  const [params, setParams] = React.useState({ name: "", room: "" } as any);
  const [state, setState] = React.useState<Array<any>>([]);
  const [stateBasket, setStateBasket] = React.useState<Array<any>>([]);
  const [message, setMessage] = React.useState("");
  const [isOpen, setOpen] = React.useState(false);
  const [userss, setUserss] = React.useState<number | any>(-5);
  const [trigger, setTrigger] = React.useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();
  const divRef: any = React.useRef(null);

  let WS = props.ws;
  if (WS.url.slice(0, 21) === "wss://localhost:3000/") debug = true;
  //console.log("props:", debug, props.ws, params);

  const PostingArchive = React.useCallback((archive: any, room: string) => {
    console.log("PostingArchive", room, archive);
    for (let i = 0; i < archive.length; i++) {
      if (archive[i].to === room) {
        maskSoob.user.name = archive[i].from;
        maskSoob.message = archive[i].message;
        maskSoob.date = archive[i].time;
        archive[i].read = true;
        let mass = JSON.parse(JSON.stringify(maskSoob));
        setState((_state) => [..._state, mass]);
        setStateBasket((_stateBasket) => [..._stateBasket, mass]);
      }
    }
  }, []);

  const BeginWork = React.useCallback(
    (arch: any) => {
      for (let i = 0; i < arch.messages.length; i++) {
        let mask = {
          from: arch.messages[i].from,
          to: arch.messages[i].to,
          message: arch.messages[i].message,
          time: arch.messages[i].time,
          read: false,
        };
        archive.push(mask);
      }
      setState([]);
      setStateBasket([]);
      PostingArchive(archive, "Global");
    },
    [PostingArchive]
  );

  //=== инициализация ======================================
  if (flagOpenDebug) {
    if (debug) {
      console.log("РЕЖИМ ОТЛАДКИ!!!");
      setTimeout(() => {
        BeginWork(dataArchive.archive);
        let aa = MakeSpisUsers(dataUsers.users);
        sistUsers = aa[0];
        console.log("sistUsers", aa[1], sistUsers);
        console.log("1params:", archive, state);
      }, 100);
    } else {
      setParams({ name: props.nik, room: "Global" });
      oldName = props.nik;
      oldRoom = "Global";
    }
    flagOpenDebug = false;
  }
  //console.log('props:', debug, props, ':', params);
  //========================================================
  React.useEffect(() => {
    WS.onopen = function (event: any) {
      console.log("WS.current.onopen:", event);
    };
    WS.onclose = function (event: any) {
      console.log("WS.current.onclose:", event);
    };
    WS.onerror = function (event: any) {
      console.log("WS.current.onerror:", event);
    };
    WS.onmessage = function (event: any) {
      let allData = JSON.parse(event.data);
      let data = allData.data;
      console.log("пришло:", userss, data.error, allData.type, data);
      switch (allData.type) {
        case "users":
          let aa = MakeSpisUsers(data.users);
          sistUsers = aa[0];
          setUserss(aa[1]);
          break;
        case "archive":
          BeginWork(data.archive);
          break;
        case "message":
          let toTo = true;
          if (data.to !== oldRoom) toTo = false;
          let mask = {
            from: data.from,
            to: data.to,
            message: data.message,
            time: data.time,
            read: toTo,
          };
          if (archive.length) archive.push(mask);
          console.log("HHHHandleSubmit", data.to, oldRoom, archive);
          setTimeout(() => {
            let maska = {
              user: { name: data.from, room: data.to },
              message: data.message,
              date: data.time,
              to: data.to,
            };
            if (data.to === oldRoom) {
              setState((_state) => [..._state, maska]);
            } else {
              setStateBasket((_stateBasket) => [..._stateBasket, maska]);
            }
          }, 100);
          setTimeout(() => {
            // 👇️ scroll to bottom every time messages change
            divRef.current && divRef.current.scrollIntoView();
          }, 150);
          break;
        case "status":
          console.log("Status:", userss, data.user, data.status);
          for (let i = 0; i < sistUsers.length; i++) {
            if (sistUsers[i].user === data.user) {
              sistUsers[i].status = data.status;
              let us = userss;
              if (sistUsers[i].status === "online") {
                us++;
                console.log("плюс!!!", us);
              } else {
                us--;
                console.log("минус!!!", us);
              }
              setUserss(us);
            }
          }
          setTrigger(!trigger);
          break;
        default:
          console.log("data_default:", data);
      }
    };
  }, [WS, PostingArchive, BeginWork, trigger, userss]);

  //=== РЕЖИМ ОТЛАДКИ ======================================
  React.useEffect(() => {
    if (debug) {
      const searchParams: any = Object.fromEntries(new URLSearchParams(search));
      setParams(searchParams);
      console.log("3params:", searchParams, oldName, oldRoom);
      if (oldName !== "oldName" && oldRoom !== "oldRoom") {
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
      socket.emit("join", searchParams);
      return () => {
        socket.off();
      };
    }
  }, [socket, search, PostingArchive]);

  const leftRoom = () => {
    if (params.room !== "Global") {
      nameKomu = "Global";
      let newParams = params;
      newParams.room = nameKomu;
      setParams(newParams);
      setState([]);
      setStateBasket([]);
      PostingArchive(archive, nameKomu);
      oldName = newParams.name;
      oldRoom = nameKomu;
      if (debug) {
        socket.emit("join", params);
        return () => {
          socket.off();
        };
      }
    } else {
      socket.emit("leftRoom", { params });
      navigate("/");
    }
  };

  React.useEffect(() => {
    if (debug) {
      socket.on("message", (event: any) => {
        console.log("event.data:", event.data, "::", oldRoom, archive);
        let toTo = true;
        if (event.data.to !== oldRoom) toTo = false;
        let mask = {
          from: event.data.user.name,
          to: event.data.to,
          message: event.data.message,
          time: event.data.date,
          read: toTo,
        };
        if (archive.length) archive.push(mask);
        console.log("HHHHandleSubmit", archive);
        setTimeout(() => {
          if (event.data.to === oldRoom) {
            setState((_state) => [..._state, event.data]);
          } else {
            setStateBasket((_stateBasket) => [..._stateBasket, event.data]);
          }
        }, 100);
        setTimeout(() => {
          // 👇️ scroll to bottom every time messages change
          divRef.current && divRef.current.scrollIntoView();
        }, 150);
      });
      socket.on("room", (event: any) => {
        console.log("ROOM:", event);
        setUserss(event.data.users.length);
        usersRooms = event.data.users;
        // 👇️ scroll to bottom every time messages change
        divRef.current && divRef.current.scrollIntoView();
      });
    }
  }, [socket]);
  //========================================================
  const handleChange = (event: any) => {
    //console.log('handleChange:', event.target.value);
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    if (!message) return;
    let date = new Date().toISOString();
    console.log("HandleSubmit:", message, params);
    if (debug) {
      socket.emit("sendMessage", { message, params, date });
    } else {
      SendSocketSendMessage(props.ws, message, params, date);
    }
    setMessage("");
  };

  const TopPartChat = () => {
    let chel = "человек";
    if (userss !== 12 && userss !== 13 && userss !== 14) {
      if (userss % 10 === 2 || userss % 10 === 3 || userss % 10 === 4)
        chel += "а";
    }
    let nameRoom = " комнате";
    let redKnop = "Покинуть комнату";
    if (params.room === "Global") {
      nameRoom = " чате";
      redKnop = "Выйти из чата";
    }
    let roomName = "Групповой чат";
    if (nameKomu !== "Global") roomName = nameKomu + "/" + params.name;

    return (
      <Box sx={styleChat02}>
        <Box sx={styleChat03}>{roomName}</Box>
        {debug && (
          <Box>
            {userss} {chel} {nameRoom}
          </Box>
        )}
        {!debug && params.room === "Global" && (
          <Box>
            {userss} {chel} {nameRoom}
          </Box>
        )}
        <Button sx={styleChat04} variant="contained" onClick={leftRoom}>
          {redKnop}
        </Button>
      </Box>
    );
  };

  const onEmojiClick = (event: any) => setMessage(`${message} ${event.emoji}`);

  const BottomPartChat = () => {
    return (
      <Box sx={styleChat16}>
        {InputerMessage(message, handleChange)}
        <Box sx={styleChat06}>
          <Button sx={styleChat061} onClick={() => setOpen(!isOpen)}>
            😊
          </Button>
          {isOpen && (
            <Box sx={styleChat07}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </Box>
          )}
        </Box>
        {SendMessage(handleSubmit)}
      </Box>
    );
  };

  const ClickKnop = (mode: number) => {
    if (debug) socket.emit("leftRoom", { params });
    console.log("1ClickKnop:", params);
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
    setStateBasket([]);
    PostingArchive(archive, roomer);
    oldName = newParams.name;
    oldRoom = roomer;
    console.log("3ClickKnop:", params, newParams);
    if (debug) {
      socket.emit("join", params);
      return () => {
        socket.off();
      };
    }
  };

  const UsersSist = () => {
    console.log("######:", userss, sistUsers);
    let resStr: any = [];
    for (let i = 0; i < sistUsers.length; i++) {
      let nameer = sistUsers[i].user;
      if (nameer.length > 15) nameer = nameer.slice(0, 15);
      let point = " ";
      for (let j = 0; j < archive.length; j++) {
        if (
          archive[j].from !== "ChatAdmin" &&
          archive[j].from === sistUsers[i].user
        ) {
          if (archive[j].to !== "Global" && !archive[j].read) point = "●";
        }
      }
      resStr.push(
        <Grid key={i} container>
          <Grid item xs={0.7} sx={styleChat081}>
            {point}
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

  //console.log("STATE:", state);

  const LeftPartChat = () => {
    return (
      <>
        {TopPartChat()}
        <Box sx={styleChat05}>
          <Box sx={{ overflowX: "auto", height: "86vh" }}>
            <Messages
              messages={state}
              name={params.name}
              basket={stateBasket}
            />
            <div ref={divRef} />
          </Box>
        </Box>
        {BottomPartChat()}
      </>
    );
  };

  let chatRoom = "чате:";
  if (params.room !== "Global") chatRoom = "комнате:";

  console.log("Glll:", userss);

  return (
    <Grid container>
      <Grid item xs={10} sx={styleChat01}>
        {LeftPartChat()}
      </Grid>

      <Grid item xs sx={styleChat01}>
        <Box sx={{ background: "#D3D3D3" }}>
          {debug && (
            <>
              {HeaderChat(chatRoom)}
              <Box sx={{ overflowX: "auto", height: "7vh" }}>
                {UsersChat(usersRooms)}
              </Box>
            </>
          )}
          {HeaderSist()}
          <Box sx={{ overflowX: "auto", height: "78.5vh" }}>{UsersSist()}</Box>
          {!debug && <Grid container sx={{ height: "14vh" }}></Grid>}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Chat;
