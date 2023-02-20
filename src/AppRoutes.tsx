import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Main from './components/Main';
import Chat from './components/Chat';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/chat" element={<Chat />} />
  </Routes>
);

export default AppRoutes;
