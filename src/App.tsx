import React from "react";
import AppRoutes from "./AppRoutes";

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

WS = new WebSocket(host);
if (WS.url.slice(0, 21) === "wss://localhost:3000/") {
  debug = true;
} else {
  nikName = window.localStorage.getItem("login");
  console.log("Ты в чате!!!", nikName);
}

const App = () => (
  <div className="container">
    {!debug && <Chat ws={WS} nik={nikName} />}
    {debug && <AppRoutes ws={WS} />}
    {/* <AppRoutes /> */}
  </div>
);

export default App;
