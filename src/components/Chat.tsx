import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
//import imageCompression from "browser-image-compression";
import "b64-to-blob";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Messages from "./Messages";
import ChatErrorMessage from "./ChatErrorMessage";

import { isNumeric, Pipip, UsersSist } from "./ChatServiceFunctions";
import { ChatServisKnop, HeaderChel } from "./ChatServiceFunctions";
import { MakeSpisUsers, InputerMessage } from "./ChatServiceFunctions";
import { DebugRigtPartChat, HeaderSist } from "./ChatServiceFunctions";
import { SendMessage, SendSocketSendMessage } from "./ChatServiceFunctions";
import { SendSocketMarkAsRead, ChatEmojiPicker } from "./ChatServiceFunctions";
import { MakeOldDate, SendSocketHistory } from "./ChatServiceFunctions";

import { styleChat01, styleChat02, styleChat05 } from "./ComponentsStyle";
import { styleChat03, styleChat04, styleChat16 } from "./ComponentsStyle";

import { dataArchive } from "./../otladkaArchive";
import { dataHistory } from "./../otladkaHistory";
import { dataUsers } from "./../otladkaUsers";

let usersRooms: any = [];
let flagOpenDebug = true;
let oldName = "oldName";
let oldRoom = "oldRoom";
let nameKomu = "Global";
let archive: any = [];
let archiveTemp: any = [];
let sistUsers: any = [];
let maxPosition = 0;
let tempPosition = 0;
let afterRoomPosition = 0;
let dStart = new Date().toISOString();
let chDays = 1;
let maxDays = 33;
let metka = false;
let turnOn = true;
let soobErr = "";
//let item: any = null;

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
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const { search } = useLocation();
  const navigate = useNavigate();
  const divRef: any = React.useRef(null);
  const scRef: any = React.useRef(null);
  const WS = props.ws;
  const debug = WS.url.slice(0, 21) === "wss://localhost:3000/" ? true : false;

  const Scrooler = () => {
    setTimeout(() => {
      // 👇️ scroll to bottom every time messages change
      divRef.current && divRef.current.scrollIntoView();
    }, 150);
  };

  // async function handleImageUpload(event: any) {
  //   const imageFile = event.target.files[0];

  //   const options = {
  //     maxSizeMB: 1,
  //     maxWidthOrHeight: 1920,
  //   };
  //   try {
  //     const compressedFile = await imageCompression(imageFile, options);
  //     console.log(compressedFile.size / 1024 / 1024);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const PostingArchive = React.useCallback(
    (room: string, mode: number, scrool: boolean) => {
      let room1 = !mode ? room : sistUsers[Number(room.slice(0, 2)) - 1].user;
      let room2 = !mode ? room : sistUsers[Number(room.slice(2, 4)) - 1].user;
      if (archive) {
        for (let i = 0; i < archive.length; i++) {
          let iffer = archive[i].to === room;
          if (mode)
            iffer =
              (archive[i].from === room1 || archive[i].from === room2) &&
              (archive[i].to === room2 || archive[i].to === room1);
          if (iffer) {
            // let compressedFile: any = null;
            // console.log('0compressedFile:', archive[i].message.slice(0, 11));
            // if (archive[i].message.slice(0, 11) === 'data:image/') {
            //   let imageFile = archive[i].message;
            //   let options = {
            //     maxSizeMB: 1,
            //     maxWidthOrHeight: 400,
            //   };
            //   compressedFile = imageCompression(imageFile, options);
            //   console.log('1compressedFile:', compressedFile);
            // }
            // setTimeout(() => {
            //   console.log('2compressedFile:', compressedFile);
            let maskSoob = {
              user: { name: archive[i].from },
              message: archive[i].message,
              date: archive[i].time,
            };
            if (!archive[i].read) {
              archive[i].read = true;
              if (archive[i].to !== "Global" && archive[i].from !== "Global")
                SendSocketMarkAsRead(
                  WS,
                  archive[i].from,
                  archive[i].to,
                  archive[i].message,
                  archive[i].time
                );
            }
            setState((_state) => [..._state, maskSoob]);
            setStateBasket((_stateBasket) => [..._stateBasket, maskSoob]);
            //}, 500);
          }
        }
        scrool && Scrooler();
      }
    },
    [WS]
  );

  const BeginWorkInRoom = React.useCallback(
    (room: string, mode: number, scrool: boolean) => {
      setState([]);
      setStateBasket([]);
      PostingArchive(room, mode, scrool);
    },
    [PostingArchive]
  );

  const BeginWork = React.useCallback(
    (arch: any, mode: number) => {
      if (arch) {
        if (arch.messages) {
          for (let i = 0; i < arch.messages.length; i++) {
            let mask = {
              from: arch.messages[i].from,
              to: arch.messages[i].to,
              message: arch.messages[i].message,
              time: arch.messages[i].time,
              read: arch.messages[i].read,
            };
            mode && archiveTemp.push(mask);
            !mode && archive.push(mask);
          }
        }
      }
      !mode && BeginWorkInRoom("Global", 0, true);
    },
    [BeginWorkInRoom]
  );

  const DelRec = (time: string) => {
    let archiveRab: any = [];
    for (let i = 0; i < archive.length; i++) {
      if (archive[i].time !== time) {
        archiveRab.push(archive[i]);
      } else {
        console.log("Запрос на удаление:", archive[i]);
      }
    }
    archive = JSON.parse(JSON.stringify(archiveRab));
    let mode = params.room === "Global" ? 0 : 1;
    BeginWorkInRoom(params.room, mode, false);
  };

  const SendReguest = React.useCallback(() => {
    if (chDays < maxDays) {
      console.log("ЗАПРОС на чтение архива №", chDays);
      if (!debug) {
        let datOt = MakeOldDate(dStart, chDays + 1);
        let datDo = MakeOldDate(dStart, chDays);
        SendSocketHistory(WS, datOt, datDo);
      } else {
        archiveTemp = [];
        if (chDays === 1 || chDays === 3 || chDays === 5 || chDays === 7) {
          BeginWork(dataHistory.history, 1);
        } else {
          BeginWork(dataArchive.archive, 1);
        }
        for (let i = 0; i < archive.length; i++) {
          archiveTemp.push(archive[i]);
        }
        archive = JSON.parse(JSON.stringify(archiveTemp));
        tempPosition = JSON.parse(JSON.stringify(maxPosition));
        BeginWorkInRoom("Global", 0, true);
      }
      chDays++;
    }
  }, [WS, BeginWork, BeginWorkInRoom, debug]);

  //=== инициализация ======================================
  if (flagOpenDebug) {
    if (debug) {
      console.log("РЕЖИМ ОТЛАДКИ!!!", dataArchive);
      setTimeout(() => {
        BeginWork(dataArchive.archive, 0);
        sistUsers = MakeSpisUsers(dataUsers.users)[0];
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
      if (komu !== oldRoom) {
        toRead = false;
        turnOn && Pipip(); // уведомление
      } else {
        if (data.to === props.nik && data.from !== "Global")
          SendSocketMarkAsRead(WS, data.from, data.to, data.message, data.time);
      }
      // let compressedFile: any = null;
      // console.log('7compressedFile:', data.message.slice(0, 11));
      // if (data.message.slice(0, 11) === 'data:image/') {
      //   let imageFile = data.message;
      //   let options = {
      //     maxSizeMB: 1,
      //     maxWidthOrHeight: 400,
      //   };
      //   compressedFile = imageCompression(imageFile, options);
      //   setTimeout(() => {
      //     console.log('8compressedFile:', compressedFile);
      //   }, 100);
      // }
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
        oldRoom === komu && setState((_state) => [..._state, maska]);
        oldRoom !== komu &&
          setStateBasket((_stateBasket) => [..._stateBasket, maska]);
        setTrigger(!trigger);
        if (isNumeric(Number(oldRoom))) Scrooler();
        if (data.from === oldName) {
          Scrooler();
        } else {
          if (komu === data.to && data.to === "Global") {
            if (maxPosition - scRef.current.scrollTop < 300) {
              Scrooler();
            } else {
              metka = true;
              turnOn && Pipip();
            }
          }
        }
      }, 100);
    },
    [WS, trigger, props.nik]
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
      console.log("пришло:", scrollPosition, allData.type, data);
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
          } else {
            BeginWork(data.archive, 0);
            setTimeout(() => {
              if (!scRef.current.scrollTop) SendReguest();
            }, 600);
          }
          break;
        case "history":
          if (!data.history.messages) {
            SendReguest();
          } else {
            archiveTemp = [];
            BeginWork(data.history, 1);
            for (let i = 0; i < archive.length; i++) {
              archiveTemp.push(archive[i]);
            }
            archive = JSON.parse(JSON.stringify(archiveTemp));
            tempPosition = JSON.parse(JSON.stringify(maxPosition));
            BeginWorkInRoom("Global", 0, true);
            setTimeout(() => {
              if (!scRef.current.scrollTop) SendReguest();
            }, 600);
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
        //console.log("data_default:", data);
      }
    };
  }, [
    WS,
    PostingArchive,
    BeginWorkInRoom,
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
          PostingArchive(searchParams.room, 0, true);
          oldName = searchParams.name;
          oldRoom = searchParams.room;
        }
      } else {
        oldName = searchParams.name;
        oldRoom = searchParams.room;
      }
      socket.emit("join", searchParams);
      return () => socket.off();
    }
  }, [socket, search, PostingArchive, debug]);

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
  React.useEffect(() => {
    if (debug) {
      socket.on("message", (event: any) => {
        console.log('EVENT',event)
        let toTo = true;
        if (event.data.to !== oldRoom) {
          toTo = false;
          turnOn && Pipip(); // уведомление
          if (event.data.to === "Global") metka = true;
        }
        let roomTo = event.data.to;
        if (isNumeric(event.data.to)) {
          roomTo = sistUsers[Number(event.data.to.slice(0, 2)) - 1].user;
          if (roomTo === event.data.user.name)
            roomTo = sistUsers[Number(event.data.to.slice(2, 4)) - 1].user;
        }
        // if (event.data.message.slice(0, 11) === "data:image/") {
          //   let poz = event.data.message.indexOf(",");
        //   let sblob = event.data.message.slice(poz+1);
        //   let b64toBlob = require('b64-to-blob');
        //   let contentType = 'image/png';
        //   let blob : any = b64toBlob(sblob, contentType)
        //   let blobUrl: any = URL.createObjectURL(blob);
        //   console.log(":::",blob,blobUrl);
        //   let reader: any = new FileReader();
        //   let compressedFile: any = null;
        //   const handleImageUpload = async () => {
        //     let options = {
        //       maxSizeMB: 1,
        //       maxWidthOrHeight: 333,
        //       useWebWorker: true,
        //     };
        //     try {
        //       compressedFile = await imageCompression(blob, options);
        //       reader.readAsDataURL(compressedFile);
        //     } catch (error) {
        //       console.log(error);
        //     }
        //   };
        //   handleImageUpload();
        //   setTimeout(() => {
        //     console.log("CompressedFile:", compressedFile,reader.result);
        //   }, 900);
        // }
        let mask = {
          from: event.data.user.name,
          to: roomTo,
          message: event.data.message,
          time: event.data.date,
          read: toTo,
        };
        archive.push(mask);
        setTimeout(() => {
          event.data.to === oldRoom &&
            setState((_state) => [..._state, event.data]);
          event.data.to !== oldRoom &&
            setStateBasket((_stateBasket) => [..._stateBasket, event.data]);
        }, 100);
        if (isNumeric(Number(oldRoom))) Scrooler();
        if (event.data.user.name === oldName) {
          Scrooler();
        } else {
          if (event.data.to === oldRoom && oldRoom === "Global") {
            if (maxPosition - scRef.current.scrollTop < 300) {
              Scrooler();
            } else {
              metka = true;
              turnOn && Pipip();
            }
          }
        }
      });

      socket.on("room", (event: any) => {
        setUsers(event.data.users.length);
        usersRooms = event.data.users;
      });
    }
  }, [socket, debug]);
  //========================================================
  const leftRoom = () => {
    if (params.room !== "Global") {
      nameKomu = "Global";
      let newParams = params;
      newParams.room = nameKomu;
      setParams(newParams);
      BeginWorkInRoom(nameKomu, 0, true);
      oldName = newParams.name;
      oldRoom = nameKomu;
      setTimeout(() => {
        if (afterRoomPosition > 0) {
          scRef.current.scrollTo(0, afterRoomPosition); // встать на прежнее место
        } else {
          GoToBottom();
          setTrigger(!trigger);
        }
        afterRoomPosition = 0;
      }, 400);
      if (debug) {
        socket.emit("join", params);
        return () => socket.off();
      }
    } else {
      if (debug) {
        socket.emit("leftRoom", { params });
        flagOpenDebug = true;
        navigate("/");
      } else {
        window.close();
      }
    }
  };

  const ClickKnop = (mode: number) => {
    afterRoomPosition = JSON.parse(JSON.stringify(scrollPosition));
    if (maxPosition === afterRoomPosition) afterRoomPosition = -1;
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
    BeginWorkInRoom(roomer, 1, true);
    oldName = newParams.name; // от кого
    oldRoom = roomer;
    if (debug) {
      socket.emit("join", params);
      return () => socket.off();
    }
  };

  const handleChange = (event: any) => setMessage(event.target.value);

  const onEmojiClick = (event: any) => setMessage(`${message} ${event.emoji}`);

  const handleSubmit = () => {
    if (!message) return;
    let date = new Date().toISOString();
    debug && socket.emit("sendMessage", { message, params, date });
    !debug && SendSocketSendMessage(WS, message, params.name, nameKomu);
    setMessage("");
  };

  const TopPartChat = () => {
    let chel = "человек";
    if (users !== 12 && users !== 13 && users !== 14)
      if (users % 10 === 2 || users % 10 === 3 || users % 10 === 4) chel += "а";
    let nameRoom = params.room !== "Global" ? "в комнате" : "в чате";
    let redKnop =
      params.room !== "Global" ? "Покинуть комнату" : "Выйти из чата";
    let roomName = "Групповой чат";
    if (nameKomu !== "Global") roomName = nameKomu + "/" + params.name;

    return (
      <Box sx={styleChat02}>
        <Box sx={styleChat03}>{roomName}</Box>
        {debug && <>{HeaderChel(users, chel, nameRoom)}</>}
        {!debug && params.room === "Global" && (
          <>{HeaderChel(users, chel, nameRoom)}</>
        )}
        <Button sx={styleChat04} variant="contained" onClick={leftRoom}>
          {redKnop}
        </Button>
      </Box>
    );
  };

  const handleClipBoard = React.useCallback(
    (evt: any) => {
      const clipboardItems: any = evt.clipboardData.items; // Получить данные буфера обмена
      console.log("%%%:", clipboardItems);
      const items: any = [].slice
        .call(clipboardItems)
        .filter(function (item: any) {
          return item.type.indexOf("image") !== -1; // Фильтровать только элементы изображения
        });
      if (!items.length) return;
      const item = items[0];
      console.log("ITEM:", item);
      const blob: any = item.getAsFile(); // Получить блок изображения
      console.log("1BLOB:", blob);
      // let compressedFile: any = null;
      // const handleImageUpload = async () => {
      //   let options = {
      //     maxSizeMB: 1,
      //     maxWidthOrHeight: 333,
      //     useWebWorker: true,
      //   };
      //   compressedFile = await imageCompression(blob, options);
      // };
      //handleImageUpload();
      //setTimeout(() => {
      //console.log('8compressedFile:', compressedFile, blob);

      let reader: any = new FileReader();
      reader.readAsDataURL(blob);
      //reader.readAsDataURL(compressedFile);
      setTimeout(() => {
        let date = new Date().toISOString();
        let pict: any = reader.result;

        if (reader.result) {
          if (pict.length > 2000000) {
            soobErr = "Размер картинки превышает лимит в 2Мбайта";
            setOpenSetErr(true);
          } else {
            let message = debug
              ? reader.result.slice(0, 999000)
              : reader.result;
            debug && socket.emit("sendMessage", { message, params, date });
            !debug && SendSocketSendMessage(WS, message, params.name, nameKomu);
          }
        }
      }, 100);

    },
    [WS, debug, params, socket]
  );

  React.useEffect(() => {
    document.addEventListener("paste", handleClipBoard);
    return () => document.removeEventListener("paste", handleClipBoard);
  }, [handleClipBoard]);

  const BootomPartChat = () => {
    return (
      <Box sx={styleChat16}>
        {InputerMessage(message, handleChange, handleSubmit)}
        {ChatEmojiPicker(isOpen, setOpen, onEmojiClick)}
        {SendMessage(handleSubmit)}
      </Box>
    );
  };

  const LeftPartChat = () => {
    React.useEffect(() => {
      const handleScroll = () => {
        const position = scRef.current.scrollTop;
        setScrollPosition(position);
        if (position > maxPosition && params.room === "Global")
          maxPosition = position;
        if (maxPosition === position && !afterRoomPosition) metka = false;
        if (tempPosition) {
          let poz = maxPosition - tempPosition;
          scRef.current.scrollTo(0, poz - 69); // встать на Якорь
          tempPosition = 0;
        }
        if (!position && params.room === "Global" && chDays < maxDays)
          SendReguest();
      };

      scRef.current.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        scRef.current &&
          scRef.current.removeEventListener("scroll", handleScroll);
      };
    });

    let pn = params.name;

    return (
      <>
        {TopPartChat()}
        <Box sx={styleChat05}>
          <Box ref={scRef} sx={{ overflowX: "auto", height: "86vh" }}>
            {state.length !== 0 && (
              <Messages
                messages={state}
                name={pn}
                basket={stateBasket}
                funcDel={DelRec}
              />
            )}
            <div ref={divRef} />
          </Box>
        </Box>
        {BootomPartChat()}
      </>
    );
  };

  const GoToBottom = () => {
    metka = false;
    !afterRoomPosition && Scrooler();
  };

  const TurnOn = () => {
    turnOn = !turnOn;
    setTrigger(!trigger);
  };

  return (
    <Grid container>
      <>
        <Grid item xs={10} sx={styleChat01}>
          {LeftPartChat()}
        </Grid>
        <Grid item xs sx={styleChat01}>
          <Box sx={{ background: "#CCDCEC" }}>
            {debug && DebugRigtPartChat(params.room, usersRooms)}
            {HeaderSist()}
            {UsersSist(sistUsers, archive, params.name, nameKomu, ClickKnop)}
            {!debug && <Grid container sx={{ height: "14vh" }}></Grid>}
            {ChatServisKnop(
              metka,
              turnOn,
              scRef,
              params.room,
              maxPosition,
              GoToBottom,
              TurnOn
            )}
          </Box>
        </Grid>
        {openSetErr && (
          <ChatErrorMessage setOpen={setOpenSetErr} sErr={soobErr} />
        )}
      </>
    </Grid>
  );
};

export default Chat;
