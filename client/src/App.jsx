import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import ChatPage from './components/UsersChat';
import Register from './components/Register';

const Router = ({ userId }) => {
  const addMessage = (message) => {
    console.log(message.message);
  };

  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/chatpage' element={<ChatPage userId={userId} />} />
    </Routes>
  );
};

export default Router;
