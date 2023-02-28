import React from "react";
import { Routes, Route } from "react-router-dom";

import Main from "./components/Main";
import Chat from "./components/Chat";

let flagOpenWS = true;
let debug = false;
let WS: any = null;
let nikName: any = '';

const host =
  "wss://" +
  window.location.host +
  window.location.pathname +
  "W" +
  window.location.search;

if (flagOpenWS) {
  WS = new WebSocket(host);
  if (WS.url.slice(0, 21) === "wss://localhost:3000/") {
    debug = true;
  } else {
    nikName = window.localStorage.getItem("login");
  }
  flagOpenWS = false;
}

const AppRoutes = () => (
  <Routes>
    {!debug && (
      <Route path="/" element={<Main />} />
    )}
    <Route path="/chat" element={<Chat ws={WS} nik={nikName} />} />
  </Routes>
);

export default AppRoutes;
