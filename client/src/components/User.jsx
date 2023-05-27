import React, { useState, useEffect } from 'react';
import './Style.css';
import { useLocation } from 'react-router-dom';

const User = () => {
  const [users, setUsers] = useState([]);
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [userid, setUserId] = useState('');
  const [contactid, setContactId] = useState('');
  const [addedContactIds, setAddedContactIds] = useState([]);

  useEffect(() => {
    const { userid } = location.state || {};

    if (userid) {
      setUserId(userid);
    }
  }, [location.state]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/contacts').then((response) => response.json()),
      fetch('http://localhost:3000/users').then((response) => response.json())
    ])
      .then(([contactData, userData]) => {
        const addedContactIds = contactData
          .filter((contact) => contact.userid === location.state.userid)
          .map((contact) => contact.contactid);
        setAddedContactIds(addedContactIds);

        const filteredUsers = userData.filter(
          (user) => !addedContactIds.includes(user.userid) && user.username !== location.state.username
        );

        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [location.state]);

  const handleContact = async (event, user) => {
    event.preventDefault();
    const parsedContactId = parseInt(user.userid, 10);

    if (isNaN(parsedContactId)) {
      console.error('Invalid contactid');
      return;
    }
    const contacts = {
      username: user.username,
      userid,
      contactid: parsedContactId,
    };
    try {
      const response = await fetch('http://localhost:3000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contacts),
      });

      if (response.ok) {
        alert('Contact Added Successfully');
        setAddedContactIds((prevIds) => [...prevIds, parsedContactId]);
        window.location.reload(); 
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="contactContainer">
      <h2>Users List</h2>

      {users.length === 0 ? (
        <p>No new users to add.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Add to Contact</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userid}>
                <td>{user.userid}</td>
                <td>{user.username}</td>
                <td>
                  <form onSubmit={(event) => handleContact(event, user)}>
                    <button
                      className='contactButton'
                      type="submit"
                      disabled={addedContactIds.includes(user.userid)}
                    >
                      Add to contact
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default User;
