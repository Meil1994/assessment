import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Style.css';

const NewChat = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const location = useLocation();
  const { contact, loggedInUserId } = location.state;

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await fetch('http://localhost:3000/chats');
        const data = await response.json();
  
        const filteredMessages = data.map((message) => {
          const isSender = message.userid === contact.userid;
          const id = isSender ? 'sender' : 'receiver';
          return { ...message, id };
        });
  
        setChatMessages(filteredMessages);
      } catch (error) {
        console.error(error);
      }
    };
  
    const pollChatMessages = () => {
      fetchChatMessages();
      const interval = setInterval(fetchChatMessages, 1000);
      return () => clearInterval(interval);
    };
  
    pollChatMessages();
  }, []);
  
  

  const handleChat = async (event) => {
    event.preventDefault();

    const chat = {
      userid: contact.userid,
      senderid: contact.contactid,
      username: contact.username,
      room: contact.idcontacts,
      message: message
    };

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chat)
      });

      if (response.ok) {
        setMessage('');
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='newChatcontainer'>
      <div className='chatHeader'>
        <h2>New Chat</h2>
        <p>Chatting with: {contact.username}</p>
      </div>
  
      <div className="messages">
        {chatMessages.length === 0 ? (
          <p>No messages to display.</p>
        ) : (
          chatMessages.map((message) => {
            const messageClass = message.id === 'sender' ? 'sender-message' : 'receiver-message';
            return (
              <div key={message.sid} className={`message-container ${messageClass}`}>
                <div className="message-wrapper">
                  <p className='main-message'>{message.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
  
      <form className='chatForm1' onSubmit={handleChat}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <button className="contactButton" type="submit">
          Send
        </button>
      </form>
    </div>
  );
  
};

export default NewChat;
