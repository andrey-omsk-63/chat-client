import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Main from './components/Main';
import Chat from './components/Chat';

let flagOpenWS = true;
let WS: any = null;
const host =
  'wss://' + window.location.host + window.location.pathname + 'W' + window.location.search;

if (flagOpenWS) {
  WS = new WebSocket(host);
  flagOpenWS = false;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/chat" element={<Chat ws={WS} />} />
  </Routes>
);

export default AppRoutes;
