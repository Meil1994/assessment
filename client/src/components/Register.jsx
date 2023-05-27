import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Style.css';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();
  
    // Create a user object with the registration data
    const users = {
      username,
      password,
    };
  
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(users),
      });
  
      if (response.ok) {
        // Registration successful, redirect to login page
        navigate('/profile', { state: { username } });
      } else {
        // Registration failed, handle the error
        const errorData = await response.json();
        console.error(errorData.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <form className='loginContainer' onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit">
        Register
      </button>
      <p className='bottomP'>Already have an account? <Link to={'/'}>login</Link></p>
    </form>
  );
};

export default Register;
