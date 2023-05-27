import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Style.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userid, setUserId] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, userid })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.message === 'Login successful') {
          console.log('Data being passed to contact:', { username, userid });
          console.log('Received userid:', data.userid);
          setUserId(data.userid);
          navigate('/profile', { state: { username, userid: data.userid } });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form className='loginContainer'>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" onClick={handleLogin}>
        Login
      </button>
      <p className='bottomP'>No account yet? <Link to={'/register'}>register</Link></p>
    </form>
  );
};

export default LoginForm;
