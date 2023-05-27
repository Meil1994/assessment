const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const Server = require("socket.io").Server;
const path = require('path');

const app = express();
const port = 3000;
app.use(cors());


//Database pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'meilchu1994',
  password: 'Caren1213',
  database: 'jci',
  authPlugins: {
    mysql_native_password: () => () => {},
  },
});

app.use(bodyParser.json());


// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  pool.execute(query, [username, password], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];
    const { userid } = user;
    return res.json({ message: 'Login successful', userid });
  });
});



//Users rendering in Contacts
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  pool.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json(results);
  });
});


//Update username or password of Edit page
app.put('/users', (req, res) => {
  const { username, password } = req.body;

  const query = 'UPDATE users SET password = ? WHERE username = ?';
  pool.execute(query, [password, username], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: 'Update successful' });
  });
});


//Server Port
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Socket.io cors error
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

//Socket.io connectors
io.on("connection", (socket) => {
  console.log('We are connected');

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});


//Create account for registration page
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  pool.execute(query, [username, password], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json({ message: 'User registered successfully' });
  });
});

//RENDER contacts
app.get('/contacts', (req, res) => {
  const query = 'SELECT * FROM contacts';
  pool.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json(results);
  });
});

 //CREATE contacts from user
app.post('/contact', (req, res) => {
  const { userid, contactid, username } = req.body;

  const query = 'INSERT INTO contacts (userid, contactid, username) VALUES (?, ?, ?)';
  pool.execute(query, [userid, contactid, username], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json({ message: 'Contact Added successfully' });
  });
});


// DELETE /contacts/:idcontacts
app.delete('/contacts/:idcontacts', (req, res) => {
  const contactId = parseInt(req.params.idcontacts, 10);

  pool.execute('DELETE FROM contacts WHERE idcontacts = ?', [contactId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while deleting the contact' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  });
});

