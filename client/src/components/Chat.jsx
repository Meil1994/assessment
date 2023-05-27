import React, { useEffect, useState } from 'react';
import './Style.css';

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ';' + new Date(Date.now()).getMinutes(),
      };

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
    }
  };

  useEffect(() => {
    if (socket) { 
      socket.on('receive_message', (data) => {
        setMessageList((list) => [...list, data]);
      });
    }
  }, [socket]);

  return (
    <div className='chatsContainer'>
      <div className="header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        {messageList.map((messageContent, index) => {
            return (
                <div className="message" id={username === messageContent.author ? "you" : "other"} key={index}>
                  <div>
                    <div className='content'>
                        <p className='mainMessage'>{messageContent.message}</p>
                    </div>
                    <div className='meta'>
                        <p>{messageContent.time}</p>
                        <p>{messageContent.author}</p>
                    </div>
                  </div>
                </div>
            );
        })}
      </div>
      <div className="chat-footer">
        <input onChange={(event) => setCurrentMessage(event.target.value)} type="text" placeholder="Message" />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
