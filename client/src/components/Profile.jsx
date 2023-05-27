import React, { useEffect, useState } from 'react';
import './Style.css';
import Logo from '../assets/receiver.jpeg';
import { VscGear } from 'react-icons/vsc';
import { MdOutlinePermContactCalendar } from 'react-icons/md';
import { AiOutlineMessage } from 'react-icons/ai';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { IoMdAlert } from 'react-icons/io';
import Edit from './Edit';
import User from './User';
import Contact from './Contact';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Profile = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showContact, setShowContact] = useState(true);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { username } = location.state || {};
    if (username) {
      setUsername(username);
    }
  }, [location.state]);

  useEffect(() => {
    // Fetch users and contacts data
    Promise.all([
      fetch('http://localhost:3000/contacts').then((response) => response.json()),
      fetch('http://localhost:3000/users').then((response) => response.json())
    ])
      .then(([contactData, userData]) => {
        const addedContactIds = contactData
          .filter((contact) => contact.userid === location.state.userid)
          .map((contact) => contact.contactid);
        const filteredUsers = userData.filter(
          (user) => !addedContactIds.includes(user.userid) && user.username !== location.state.username
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [location.state]);

  const handleUsersClick = () => {
    setShowUsers(true);
    setShowEdit(false);
    setShowContact(false);
  };

  const handleEditClick = () => {
    setShowUsers(false);
    setShowEdit(true);
    setShowContact(false);
  };

  const handleContactClick = () => {
    setShowUsers(false);
    setShowEdit(false);
    setShowContact(true);
  };

  function logout() {
    navigate('/');
  }

  const LoadChat = () => {
    navigate("/chatpage");
  };

  return (
    <div>
      <div className="profileContainer">
        <div className="profile">
          <div className="profileLogo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="profileInfo">
            <p>{username}</p>
          </div>
        </div>

        <div className="noti">
          <VscGear onClick={handleEditClick} />
          <div>
            <AiOutlineUserAdd className='profileIcon' onClick={handleUsersClick} />
            {users.length > 0 && <p className='alert'><IoMdAlert/></p>}
          </div>
          <MdOutlinePermContactCalendar onClick={handleContactClick} />
          <AiOutlineMessage onClick={LoadChat} />
          <button onClick={logout}>
            <FiLogOut /> <label>logout</label>
          </button>
        </div>

        <div>
          {showEdit && <Edit />}
          {showUsers && <User />}
          {showContact && <Contact />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
