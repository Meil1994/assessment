import React, { useState, useEffect } from 'react';
import './Style.css';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/contacts')
      .then((response) => response.json())
      .then((data) => {
        const filteredContacts = data.filter((contact) => contact.userid === location.state.userid);
        setContacts(filteredContacts);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [location.state.userid]);

  const handleDeleteContact = async (contactId) => {
    try {
      const response = await fetch(`http://localhost:3000/contacts/${contactId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Contact deleted successfully
        // Refresh the contacts list
        const updatedContacts = contacts.filter((contact) => contact.idcontacts !== contactId);
        setContacts(updatedContacts);
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChatClick = (contact, loggedInUserId, loggedInUsername) => {
    console.log('Clicked contact:', contact);
    console.log('Logged in userId:', loggedInUserId);
    console.log('Logged in username:', loggedInUsername);
  
    navigate('/newchat', {
      state: {
        contact,
        loggedInUserId,
        loggedInUsername,
      },
    });
  };
  

  return (
    <div className="contactContainer">
      <h2>My Contacts</h2>

      {contacts.length === 0 ? (
        <p>No contacts added yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Delete</th>
              <th>Chat</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.idcontacts}>
                <td>{contact.contactid}</td>
                <td>{contact.username}</td>
                <td>
                  <button
                    className="contactButton"
                    type="button"
                    onClick={() => handleDeleteContact(contact.idcontacts)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    className="contactButton"
                    type="button"
                    onClick={() => handleChatClick(contact, location.state.loggedInUserId, location.state.loggedInUsername)}
                  >
                    Chat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Contact;
