import React from "react";
import AppRoutes from "./AppRoutes";
import io from "socket.io-client";

import Chat from "./components/Chat";

let debug = false;
let WS: any = null;
let nikName: any = "";

const host =
  "wss://" +
  window.location.host +
  window.location.pathname +
  "W" +
  window.location.search;

const ioo: any = io;
let socket: any = null;

WS = new WebSocket(host);
if (WS.url.slice(0, 21) === "wss://localhost:3000/") {
  debug = true;
  socket = ioo.connect("http://localhost:5000");
} else {
  nikName = window.localStorage.getItem("login");
  console.log("Ты в чате!!!", nikName);
}

const App = () => (
  <div className="container">
    {!debug && <Chat ws={WS} Socket={socket} nik={nikName} />}
    {debug && <AppRoutes ws={WS} Socket={socket} />}
    {/* <AppRoutes /> */}
  </div>
);

export default App;
