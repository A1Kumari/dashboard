const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'simple',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed: ', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.get('/data', (req, res) => {
  const query = 'SELECT * FROM simple';
  db.query(query, (err, results) => {
    if (err) {
      console.error('MySQL query error: ', err);
      res.status(500).json({ error: 'Error fetching data from MySQL' });
    } else {
      res.json(results);
    }
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
