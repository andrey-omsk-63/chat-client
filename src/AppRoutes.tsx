import React from "react";
import { Routes, Route } from "react-router-dom";

import Main from "./components/Main";
import Chat from "./components/Chat";

//let WS: any = 'wss://localhost:3000/';
//let nikName: any = '';

const AppRoutes = (props: { ws: WebSocket; Socket: any }) => (
  <Routes>
    {/* {debug && <Route path="/" element={<Main />} />} */}
    <Route path="/" element={<Main />} />
    <Route
      path="/chat"
      element={<Chat ws={props.ws} Socket={props.Socket} nik={""} />}
    />
  </Routes>
);

export default AppRoutes;
