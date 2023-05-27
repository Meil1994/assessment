import React, { useState, useEffect } from 'react';
import './Style.css';
import { useLocation } from 'react-router-dom';

const Edit = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.username) {
      setUsername(location.state.username);
    }
  }, [location.state]);

  const handleSave = () => {
    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }

    fetch('http://localhost:3000/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert('Update successful');
      })
      .catch((error) => {
        console.error(error);
        alert('Update failed');
      });
  };

  return (
    <div className="editContainer">
      <h2 className='contactHead'>Edit Profile</h2>
      <form className='form2'>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className='label1'>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  );
};

export default Edit;
