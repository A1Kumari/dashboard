const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // For password hashing
const cors = require('cors');

app.use(cors()); // Enable CORS

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'dashboard',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

app.use(bodyParser.json());

const secretKey = 'your-secret-key';

const saltRounds = 10; // For password hashing

app.get('/api/user', (req, res) => {
  // Perform a database query to retrieve user data
  const query = 'SELECT * FROM users'; // Adjust this query based on your database schema

  db.query(query, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Send the retrieved user data as a JSON response
    res.json({ users: rows });
  });
});

app.get('/api/dashboard', (req, res) => {
  // Assuming you have user-specific data in the database
  const userId = req.session.userId; // Assuming you have a session setup

  // Perform a database query to retrieve dashboard data for the user
  const query = 'SELECT * FROM dashboard_data WHERE user_id = ?';

  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.json(rows); // Send the retrieved dashboard data as a JSON response
  });
});


app.get('/api/personal-info', (req, res) => {
  const userId = req.session.userId; // Assuming you have a session setup
  const query = 'SELECT * FROM personal_info WHERE user_id = ?';
  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.json({ personalInfo: rows });
  });
});

// ... (your existing code)

app.post('/api/login', (req, res) => {
  console.log('Received login request');

  const { username, password } = req.body;
  console.log('Received login request with username:', username);

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (rows.length === 0) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials 1' });
    }

    const storedPassword = rows[0].password;
    console.log('Stored Password:', storedPassword);

    if (password === storedPassword) {
      // Log the user ID before sending the token
      const userId = rows[0].id;
      console.log('User ID:', userId);

      console.log('Password matches');
      const token = jwt.sign({ username: rows[0].username }, secretKey);
      res.status(200).json({ token }); // Send the token as a response
    } else {
      console.log('Password does not match');
      res.status(401).json({ message: 'Invalid credentials 2' });
    }
  });
});

// ... (your existing code)

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
