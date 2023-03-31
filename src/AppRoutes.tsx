import React from "react";
import { Routes, Route } from "react-router-dom";

import Main from "./components/Main";
import Chat from "./components/Chat";

const AppRoutes = (props: { ws: WebSocket; Socket: any }) => (
  <Routes>
    <Route path="/" element={<Main />} />
    <Route
      path="/chat"
      element={<Chat ws={props.ws} Socket={props.Socket} nik={""} />}
    />
  </Routes>
);

export default AppRoutes;
