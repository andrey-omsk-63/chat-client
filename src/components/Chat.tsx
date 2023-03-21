import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Messages from "./Messages";

import { MakeSpisUsers, InputerMessage } from "./ChatServiceFunctions";
import { HeaderChat, HeaderSist, UsersChat } from "./ChatServiceFunctions";
import { SendMessage, SendSocketSendMessage } from "./ChatServiceFunctions";
import { MakeOldDate, SendSocketHistory } from "./ChatServiceFunctions";

import { styleChat01, styleChat02, styleChat08 } from "./ComponentsStyle";
import { styleChat03, styleChat04, styleChat16 } from "./ComponentsStyle";
import { styleChat05, styleChat06, styleChat07 } from "./ComponentsStyle";
import { styleChat081, styleChat061 } from "./ComponentsStyle";

import { dataArchive } from "./../otladkaArchive";
import { dataHistory } from "./../otladkaHistory";
import { dataUsers } from "./../otladkaUsers";

let usersRooms: any = [];
let debug = false;
let flagOpenDebug = true;
let oldName = "oldName";
let oldRoom = "oldRoom";
let nameKomu = "Global";
let archive: any = [];
let archiveTemp: any = [];
let sistUsers: any = [];
let dStart = new Date().toISOString();

const Chat = (props: { ws: WebSocket; Socket: any; nik: any }) => {
  let socket = props.Socket;
  const [params, setParams] = React.useState({ name: "", room: "" } as any);
  const [state, setState] = React.useState<Array<any>>([]);
  const [stateBasket, setStateBasket] = React.useState<Array<any>>([]);
  const [message, setMessage] = React.useState("");
  const [isOpen, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState<number | any>(-5);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [trigger, setTrigger] = React.useState(false);
  const { search } = useLocation();
  const navigate = useNavigate();
  const divRef: any = React.useRef(null);
  const scRef: any = React.useRef(null);
  const WS = props.ws;

  const Scrooler = () => {
    setTimeout(() => {
      // 👇️ scroll to bottom every time messages change
      divRef.current && divRef.current.scrollIntoView();
    }, 150);
  };

  const PostingArchive = React.useCallback(
    (archive: any, room: string, mode: number) => {
      let room1 = room;
      let room2 = room;
      if (mode) {
        room1 = sistUsers[Number(room.slice(0, 2)) - 1].user;
        room2 = sistUsers[Number(room.slice(2, 4)) - 1].user;
      }
      if (archive) {
        for (let i = 0; i < archive.length; i++) {
          let iffer = archive[i].to === room;
          if (mode)
            iffer =
              (archive[i].from === room1 || archive[i].from === room2) &&
              (archive[i].to === room2 || archive[i].to === room1);
          if (iffer) {
            let maskSoob = {
              user: { name: archive[i].from },
              message: archive[i].message,
              date: archive[i].time,
            };
            archive[i].read = true;
            setState((_state) => [..._state, maskSoob]);
            setStateBasket((_stateBasket) => [..._stateBasket, maskSoob]);
          }
        }
        Scrooler();
      }
    },
    []
  );

  const BeginWorkInRoom = React.useCallback(
    (room: string, mode: number) => {
      setState([]);
      setStateBasket([]);
      PostingArchive(archive, room, mode);
    },
    [PostingArchive]
  );

  const BeginWork = React.useCallback(
    (arch: any, mode: number) => {
      console.log("ARCH:", mode, arch);
      if (arch) {
        if (arch.messages) {
          for (let i = 0; i < arch.messages.length; i++) {
            let mask = {
              from: arch.messages[i].from,
              to: arch.messages[i].to,
              message: arch.messages[i].message,
              time: arch.messages[i].time,
              read: false,
            };
            mode && archiveTemp.push(mask);
            !mode && archive.push(mask);
          }
        }
      }
      // let mess = '🙋‍♂️ ' + props.nik + ' присоеденился';
      // if (debug) {
      //   let message = mess;
      //   let params = { name: 'ChatAdmin', room: 'Global' };
      //   let date = new Date().toISOString();
      //   socket.emit('sendMessage', { message, params, date });
      // } else {
      //   SendSocketSendMessage(props.ws, mess, 'ChatAdmin', 'Global');
      // }
      BeginWorkInRoom("Global", 0);
    },
    [BeginWorkInRoom]
  );

  const SendReguest = React.useCallback(() => {
    console.log("0*ОТПРАВИТЬ ЗАПРОС", dStart, MakeOldDate(dStart, 1), archive);
    SendSocketHistory(WS, MakeOldDate(dStart, 2), dStart);
    if (debug) {
      archiveTemp = [];
      BeginWork(dataHistory.archive, 1);
      console.log("1archiveTemp:", archiveTemp);
      for (let i = 0; i < archive.length; i++) {
        archiveTemp.push(archive[i]);
      }
      console.log("2archiveTemp:", archiveTemp);
      archive = archiveTemp;
      console.log("archive:", archive);
    }
  }, [WS, BeginWork]);

  //=== инициализация ======================================
  if (flagOpenDebug) {
    if (WS.url.slice(0, 21) === "wss://localhost:3000/") debug = true;
    if (debug) {
      console.log("РЕЖИМ ОТЛАДКИ!!!");
      setTimeout(() => {
        BeginWork(dataArchive.archive, 0);
        let aa = MakeSpisUsers(dataUsers.users);
        sistUsers = aa[0];
      }, 100);
      Scrooler();
    } else {
      setParams({ name: props.nik, room: "Global" });
      oldName = props.nik;
      oldRoom = "Global";
    }
    flagOpenDebug = false;
  }
  //=== работа на сервере ==================================
  const MessageProcess = React.useCallback(
    (data: any) => {
      let toRead = true;
      let komu = data.to;
      if (komu !== "Global") {
        let id1 = "00";
        let id2 = "00";
        for (let i = 0; i < sistUsers.length; i++) {
          if (sistUsers[i].user === komu) id1 = sistUsers[i].id; // кому
          if (sistUsers[i].user === data.from) id2 = sistUsers[i].id; // от кого
        }
        let roomer = id1 + id2;
        if (Number(id2) < Number(id1)) roomer = id2 + id1;
        komu = roomer;
      }
      if (komu !== oldRoom) toRead = false;
      let mask = {
        from: data.from,
        to: data.to,
        message: data.message,
        time: data.time,
        read: toRead,
      };
      archive.push(mask);
      setTimeout(() => {
        let maska = {
          user: { name: data.from, room: data.to },
          message: data.message,
          date: data.time,
          to: komu,
        };
        if (oldRoom === komu) {
          setState((_state) => [..._state, maska]);
        } else {
          setStateBasket((_stateBasket) => [..._stateBasket, maska]);
        }
        setTrigger(!trigger);
      }, 100);
      Scrooler();
    },
    [trigger]
  );

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
      console.log("пришло:", allData.type, data);
      switch (allData.type) {
        case "users":
          let aa = MakeSpisUsers(data.users);
          sistUsers = aa[0];
          setUsers(aa[1]);
          break;
        case "archive":
          dStart = data.archive.timeStart;
          if (!data.archive.messages) {
            SendReguest();
            console.log("1*ОТПРАВИТЬ ЗАПРОС", data.archive.messages);
          } else {
            setTimeout(() => {
              BeginWork(data.archive, 0);
            }, 100);
            if (!scrollPosition) {
              console.log("3*ОТПРАВИТЬ ЗАПРОС", scrollPosition);
              SendReguest();
            }
          }
          break;
        case "message":
          MessageProcess(data);
          break;
        case "status":
          for (let i = 0; i < sistUsers.length; i++) {
            if (sistUsers[i].user === data.user) {
              sistUsers[i].status = data.status;
              if (sistUsers[i].status === "online") setUsers(users + 1);
              if (sistUsers[i].status === "offline") setUsers(users - 1);
            }
          }
          setTrigger(!trigger);
          break;
        default:
          console.log("data_default:", data);
      }
    };
  }, [
    WS,
    PostingArchive,
    BeginWork,
    trigger,
    users,
    scrollPosition,
    MessageProcess,
    SendReguest,
  ]);
  //=== РЕЖИМ ОТЛАДКИ ======================================
  React.useEffect(() => {
    if (debug) {
      const searchParams: any = Object.fromEntries(new URLSearchParams(search));
      setParams(searchParams);
      if (oldName !== "oldName" && oldRoom !== "oldRoom") {
        if (oldName !== searchParams.name || oldRoom !== searchParams.room) {
          console.log("2params:", archive);
          PostingArchive(archive, searchParams.room, 0);
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

  const isNumeric = (n: number) => !isNaN(n);

  React.useEffect(() => {
    if (debug) {
      socket.on("message", (event: any) => {
        console.log("Event:", event);
        let toTo = true;
        if (event.data.to !== oldRoom) toTo = false;
        let roomTo = event.data.to;
        if (isNumeric(event.data.to)) {
          roomTo = sistUsers[Number(event.data.to.slice(0, 2)) - 1].user;
          if (roomTo === event.data.user.name) {
            roomTo = sistUsers[Number(event.data.to.slice(2, 4)) - 1].user;
          }
        }
        let mask = {
          from: event.data.user.name,
          to: roomTo,
          message: event.data.message,
          time: event.data.date,
          read: toTo,
        };
        archive.push(mask);
        setTimeout(() => {
          if (event.data.to === oldRoom) {
            setState((_state) => [..._state, event.data]);
          } else {
            setStateBasket((_stateBasket) => [..._stateBasket, event.data]);
          }
        }, 100);
        Scrooler();
      });
      socket.on("room", (event: any) => {
        setUsers(event.data.users.length);
        usersRooms = event.data.users;
        divRef.current && divRef.current.scrollIntoView();
      });
    }
  }, [socket]);
  //========================================================
  const leftRoom = () => {
    if (params.room !== "Global") {
      nameKomu = "Global";
      let newParams = params;
      newParams.room = nameKomu;
      setParams(newParams);
      BeginWorkInRoom(nameKomu, 0);
      oldName = newParams.name;
      oldRoom = nameKomu;
      if (debug) {
        socket.emit("join", params);
        return () => {
          socket.off();
        };
      }
    } else {
      //let parr = params;
      if (debug) {
        //let date = new Date().toISOString();
        //let message = '🏃 ' + parr.name + ' вышел';
        //let params = { name: 'ChatAdmin', room: 'Global' };
        //socket.emit('sendMessage', { message, params, date });
        //params = { name: parr.name, room: 'Global' };
        socket.emit("leftRoom", { params });
        flagOpenDebug = true;
        navigate("/");
      } else {
        //let message = '🏃 ' + props.nik + ' вышел';
        //SendSocketSendMessage(props.ws, message, 'ChatAdmin', 'Global');
        window.close();
      }
    }
  };

  const ClickKnop = (mode: number) => {
    if (debug) socket.emit("leftRoom", { params });
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
    BeginWorkInRoom(roomer, 1);
    oldName = newParams.name; // от кого
    oldRoom = roomer;
    if (debug) {
      socket.emit("join", params);
      return () => {
        socket.off();
      };
    }
  };

  const handleChange = (event: any) => setMessage(event.target.value);

  const handleSubmit = () => {
    if (!message) return;
    let date = new Date().toISOString();
    if (debug) {
      console.log("handleSubmit:", params, nameKomu, message);
      socket.emit("sendMessage", { message, params, date });
    } else {
      SendSocketSendMessage(props.ws, message, params.name, nameKomu);
    }
    setMessage("");
  };

  const TopPartChat = () => {
    let chel = "человек";
    if (users !== 12 && users !== 13 && users !== 14) {
      if (users % 10 === 2 || users % 10 === 3 || users % 10 === 4) chel += "а";
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
          <Box sx={{ fontSize: 12.9 }}>
            <b>
              {users} {chel} {nameRoom}
            </b>
          </Box>
        )}
        {!debug && params.room === "Global" && (
          <Box sx={{ fontSize: 12.9 }}>
            <b>
              {users} {chel} {nameRoom}
            </b>
          </Box>
        )}
        <Button sx={styleChat04} variant="contained" onClick={leftRoom}>
          {redKnop}
        </Button>
      </Box>
    );
  };

  const onEmojiClick = (event: any) => setMessage(`${message} ${event.emoji}`);

  const BootomPartChat = () => {
    return (
      <Box sx={styleChat16}>
        {InputerMessage(message, handleChange)}
        <Box sx={styleChat06}>
          <Button sx={styleChat061} onClick={() => setOpen(!isOpen)}>
            😎
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

  const UsersSist = () => {
    let resStr: any = [];
    for (let i = 0; i < sistUsers.length; i++) {
      let nameer = sistUsers[i].user;
      if (nameer.length > 15) nameer = nameer.slice(0, 15);
      let coler = sistUsers[i].status !== "online" ? "black" : "blue";
      let point = " ";
      for (let j = 0; j < archive.length; j++) {
        if (
          archive[j].from !== "ChatAdmin" &&
          archive[j].from !== params.name &&
          archive[j].from === sistUsers[i].user
        ) {
          if (
            archive[j].to !== "Global" &&
            archive[j].to === params.name &&
            !archive[j].read
          )
            point = "●";
        }
      }

      const styleChatBut01 = {
        fontSize: 12,
        border: "2px solid #000",
        bgcolor: "#E6F5D6",
        width: "105px",
        height: "20px",
        borderColor: "#E6F5D6",
        borderRadius: 2,
        color: coler,
        textTransform: "unset !important",
      };

      resStr.push(
        <Grid key={i} container>
          <Grid item xs={0.7} sx={styleChat081}>
            {point}
          </Grid>
          <Grid item xs sx={styleChat08}>
            <Box sx={{ color: coler }}>
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
                  {sistUsers[i].status !== "online" && <em>{nameer}</em>}
                  {sistUsers[i].status === "online" && <b>{nameer}</b>}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  const LeftPartChat = () => {
    const handleScroll = () => {
      const position = scRef.current.scrollTop;
      console.log("position:", position);
      if (!position) {
        console.log("2*ОТПРАВИТЬ ЗАПРОС", position);
        SendReguest();
      }
      setScrollPosition(position);
    };

    React.useEffect(() => {
      scRef.current.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        scRef.current.removeEventListener("scroll", handleScroll);
      };
    }, []);

    let pn = params.name;
    return (
      <>
        {TopPartChat()}
        <Box sx={styleChat05}>
          <Box ref={scRef} sx={{ overflowX: "auto", height: "86vh" }}>
            <Messages messages={state} name={pn} basket={stateBasket} />
            <div ref={divRef} />
          </Box>
        </Box>
        {BootomPartChat()}
      </>
    );
  };

  return (
    <Grid container>
      <Grid item xs={10} sx={styleChat01}>
        {LeftPartChat()}
      </Grid>
      <Grid item xs sx={styleChat01}>
        <Box sx={{ background: "#CCDCEC" }}>
          {debug && (
            <>
              {HeaderChat(params.room !== "Global" ? "комнате:" : "чате:")}
              <Box sx={{ overflowX: "auto", height: "7vh" }}>
                {UsersChat(usersRooms)}
              </Box>
            </>
          )}
          {HeaderSist()}
          <Box sx={{ overflowX: "auto", height: "78.75vh" }}>{UsersSist()}</Box>
          {!debug && <Grid container sx={{ height: "14vh" }}></Grid>}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Chat;
