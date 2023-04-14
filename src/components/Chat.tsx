import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
//import 'b64-to-blob';

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
import { MakeNewBlob } from "./ChatServiceFunctions";

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
let archiveMess: any = [];
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
let blob: any = null;
let reader: any = null;
let compressedFile: any = null;

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

  const ScroolOrPip = React.useCallback(() => {
    if (maxPosition - scRef.current.scrollTop < 300) {
      Scrooler();
    } else {
      metka = true;
      turnOn && Pipip();
    }
  }, []);

  const handleImageUpload = async () => {
    let options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 320,
      useWebWorker: true,
    };
    try {
      compressedFile = await imageCompression(blob, options);
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

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

  // function asynchronousProcess(arg0: () => void) {
  //   throw new Error("Функция не реализована.");
  // }

  const BeginWork = React.useCallback(
    (arch: any, mode: number) => {
      let pipa = true;
      if (arch) {
        if (arch.messages) {
          let archiveRab: any = [];
          let archivePict: any = [];
          for (let i = 0; i < arch.messages.length; i++) {
            let mask = {
              from: arch.messages[i].from,
              to: arch.messages[i].to,
              message: arch.messages[i].message,
              time: arch.messages[i].time,
              read: arch.messages[i].read,
            };
            archiveRab.push(mask);
            if (arch.messages[i].message.slice(0, 11) === "data:image/")
              archivePict.push(mask);
            //======
            mode && archiveTemp.push(mask);
            //console.log("0arch.messages",arch.messages[i] , "0archive:", archive);
            !mode && archive.push(mask);
          }
          let dateMapGl = JSON.parse(JSON.stringify(archive));
          console.log("arch.messages", arch.messages, "archive:", dateMapGl);
          //======
          if (archivePict.length) {
            pipa = false;
            console.log("archivePict:", archivePict, archive);
            let massPict: any = [];
            for (let i = 0; i < archivePict.length; i++) {
              const asynchronousProcess = async (arg0: () => void) => {
                let options = {
                  maxSizeMB: 1,
                  maxWidthOrHeight: 320,
                  useWebWorker: true,
                };
                let items: any = archivePict[i].message;
                let blob: any = MakeNewBlob(items);
                let reader: any = new FileReader();
                let compressedFile = await imageCompression(blob, options);
                console.log("compressedFile:", compressedFile);
                reader.readAsDataURL(compressedFile);
                const handleMake = () => {
                  if (reader.result !== null) {
                    console.log("%%%%%%:", i);
                    let mess =
                      reader.result.length < 200 ? items : reader.result; // если длина спрессованной картинки < 200байт - косячная картинка
                    let mask = {
                      message: mess,
                      time: arch.messages[i].time,
                    };
                    massPict.push(mask);
                    if (massPict.length === archivePict.length) {
                      let dateMapGl2 = JSON.parse(JSON.stringify(archive));
                      console.log("archive:", dateMapGl2);
                      console.log("Всё!!!", massPict, archive);
                      let leng = mode ? archiveTemp.length : dateMapGl2.length;
                      for (let j = 0; j < massPict.length; j++) {
                        for (let i = 0; i < leng; i++) {
                          if (mode) {
                            if (archiveTemp[i].time === massPict[j].time) {
                              archiveTemp[i].message = massPict[j].message;
                              console.log("Замена в archiveTemp", i);
                            }
                          } else {
                            //console.log("######",i, archive, archive[i]);
                            if (dateMapGl2[i].time === massPict[j].time) {
                              dateMapGl2[i].message = massPict[j].message;
                              console.log("Замена в archive", i, j);
                            }
                          }
                        }
                      }
                      console.log('dateMapGl2',dateMapGl2)
                      pipa = true;
                    }
                  } else {
                    setTimeout(() => {
                      handleMake();
                    }, 100);
                  }
                };
                handleMake();
                console.log("massPict:", i, massPict);
              };

              (function (cntr) {
                asynchronousProcess(function () {
                  console.log("cntr", cntr);
                });
              })(i);
            }
          }
          //======
        }
      }
      const PipMake = () => {
        if (pipa) {
          !mode && BeginWorkInRoom("Global", 0, true);
        } else {
          setTimeout(() => {
            PipMake();
          }, 100);
        }
      };
      PipMake();
    },
    [BeginWorkInRoom]
  );

  // const BeginWork = (arch: any, mode: number) => {
  //   const DoDoDo = (i: any) => {
  //     let items = arch.messages[i];
  //     const StateEntry = (MESS: any) => {
  //       let mask = {
  //         from: items.from,
  //         to: items.to,
  //         //message: arch.messages[i].message,
  //         message: MESS,
  //         time: items.time,
  //         read: items.read,
  //       };
  //       mode && archiveTemp.push(mask);
  //       !mode && archive.push(mask);
  //     };
  //     if (items.message.slice(0, 11) === "data:image/") {
  //       blob = MakeNewBlob(items.message);
  //       reader = new FileReader();
  //       compressedFile = null;
  //       handleImageUpload();
  //       console.log("%%%%%%:", compressedFile, reader.result);
  //       const handleMake = () => {
  //         if (reader.result !== null) {
  //           let mess =
  //             reader.result.length < 200 ? items.message : reader.result; // если длина спрессованной картинки < 200байт - косячная картинка
  //           console.log("MESS:", mess);
  //           StateEntry(mess);
  //           console.log("111");
  //           let mask = {
  //             message: items.message,
  //             time: items.time,
  //           };
  //           archiveMess.push(mask);
  //         } else {
  //           setTimeout(() => {
  //             handleMake();
  //           }, 100);
  //         }
  //       };
  //       handleMake();
  //     } else {
  //       StateEntry(items.message); //текстовое сообщение
  //       console.log("222");
  //     }
  //   };

  //   if (arch) {
  //     if (arch.messages) {

  //       (async () => {
  //         for (let i = 1; i < arch.messages.length; i++) {
  //           await DoDoDo(i);
  //         }
  //       })();
  //       //js циклы с setTimeout
  //     }
  //   }
  //   !mode && BeginWorkInRoom("Global", 0, true);
  // };

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
      const StateEntry = (MESS: any) => {
        let mask = {
          from: data.from,
          to: data.to,
          message: MESS,
          time: data.time,
          read: toRead,
        };
        archive.push(mask);
        let maska = {
          user: { name: data.from, room: data.to },
          message: MESS,
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
          if (komu === data.to && data.to === "Global") ScroolOrPip();
        }
      };
      //============
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

      if (data.message.slice(0, 11) === "data:image/") {
        blob = MakeNewBlob(data.message);
        reader = new FileReader();
        compressedFile = null;
        handleImageUpload();
        const handleMake = () => {
          if (reader.result !== null) {
            let mess =
              reader.result.length < 200 ? data.message : reader.result; // если длина спрессованной картинки < 200байт - косячная картинка
            StateEntry(mess);
            let mask = {
              message: data.message,
              time: data.time,
            };
            archiveMess.push(mask);
          } else {
            setTimeout(() => {
              handleMake();
            }, 100);
          }
        };
        handleMake();
      } else {
        StateEntry(data.message); //текстовое сообщение
      }
    },
    [WS, trigger, props.nik, ScroolOrPip]
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

  React.useEffect(() => {
    if (debug) {
      socket.on("message", (event: any) => {
        const StateEntry = (MESS: any) => {
          let eventData = event.data;
          eventData.message = MESS;
          let roomTo = event.data.to;
          if (isNumeric(event.data.to)) {
            roomTo = sistUsers[Number(event.data.to.slice(0, 2)) - 1].user;
            if (roomTo === event.data.user.name)
              roomTo = sistUsers[Number(event.data.to.slice(2, 4)) - 1].user;
          }
          let mask = {
            from: event.data.user.name,
            to: roomTo,
            message: MESS,
            time: event.data.date,
            read: toTo,
          };
          archive.push(mask);
          //setTimeout(() => {
          event.data.to === oldRoom &&
            setState((_state) => [..._state, eventData]);
          event.data.to !== oldRoom &&
            setStateBasket((_stateBasket) => [..._stateBasket, eventData]);
          if (isNumeric(Number(oldRoom))) Scrooler();
          if (event.data.user.name === oldName) {
            Scrooler();
          } else {
            if (event.data.to === oldRoom && oldRoom === "Global")
              ScroolOrPip();
          }
        };
        //============
        let toTo = true;
        if (event.data.to !== oldRoom) {
          toTo = false;
          turnOn && Pipip(); // уведомление
          if (event.data.to === "Global") metka = true;
        }
        if (event.data.message.slice(0, 11) === "data:image/") {
          blob = MakeNewBlob(event.data.message); // картинка
          reader = new FileReader();
          compressedFile = null;
          handleImageUpload();
          const handleMake = () => {
            if (reader.result !== null) {
              //console.log("1compressedFile", reader.result, reader.result);
              let mess =
                reader.result < 200 ? event.data.message : reader.result; // если длина спрессованной картинки < 200байт - косячная картинка
              StateEntry(mess);
              let mask = {
                message: event.data.message,
                time: event.data.date,
              };
              archiveMess.push(mask);
            } else {
              setTimeout(() => {
                handleMake();
              }, 100);
            }
          };
          handleMake();
        } else {
          StateEntry(event.data.message); //текстовое сообщение
        }
      });

      socket.on("room", (event: any) => {
        setUsers(event.data.users.length);
        usersRooms = event.data.users;
      });
    }
  }, [socket, debug, ScroolOrPip]);
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
      const items: any = [].slice
        .call(clipboardItems)
        .filter(function (item: any) {
          return item.type.indexOf("image") !== -1; // Фильтровать только элементы изображения
        });
      if (!items.length) return;
      const item = items[0];
      const blob: any = item.getAsFile(); // Получить блок изображения
      let reader: any = new FileReader();
      reader.readAsDataURL(blob);
      setTimeout(() => {
        let date = new Date().toISOString();
        let pict: any = reader.result;
        if (reader.result) {
          //console.log("Оригинал:", reader.result);
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

/// const BeginWork = React.useCallback(
//   (arch: any, mode: number) => {
//     if (arch) {
//       if (arch.messages) {
//         for (let i = 0; i < arch.messages.length; i++) {
//           let mask = {
//             from: arch.messages[i].from,
//             to: arch.messages[i].to,
//             message: arch.messages[i].message,
//             time: arch.messages[i].time,
//             read: arch.messages[i].read,
//           };
//           mode && archiveTemp.push(mask);
//           !mode && archive.push(mask);
//         }
//       }
//     }
//     !mode && BeginWorkInRoom("Global", 0, true);
//   },
//   [BeginWorkInRoom]
// );
