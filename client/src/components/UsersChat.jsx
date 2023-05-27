import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';

const UsersChat = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [socket, setSocket] = useState(null); 
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3000'); 

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    newSocket.on('chat', (chat) => {
      console.log('Received chat:', chat);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    setSocket(newSocket); 

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }

  return (
    <div>
      {!showChat ? (
        <div className='userChatContainer'>
          <h3>Join a Chat</h3>
          <input onChange={(event) => { setUsername(event.target.value) }} type='text' placeholder='Name...' />
          <input onChange={(event) => { setRoom(event.target.value) }} type='text' placeholder='Room ID...' />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
};

export default UsersChat;
