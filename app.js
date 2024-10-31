const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/routes', express.static(path.join(__dirname, 'routes')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup-process', (req, res) => {
  const { name, email, password, role } = req.body;
  const filePath = path.join(__dirname, 'data', role === 'teacher' ? 'teachers.csv' : 'students.csv');

  const data = `${name},${email},${password}\n`;

  fs.appendFile(filePath, data, (err) => {
      if (err) {
          console.error('Error writing to CSV file', err);
          return res.status(500).send('Error signing up, please try again.');
      }
      console.log(`${role} signed up successfully`);
      res.send(`${role.charAt(0).toUpperCase() + role.slice(1)} signed up successfully!`);
  });
});

app.get('/student-login', (req, res) => {
  res.render('student-login');
});

app.get('/teacher-login', (req, res) => {
  res.render('teacher-login');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});