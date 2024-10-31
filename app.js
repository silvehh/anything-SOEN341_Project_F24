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
  const signup = req.query.signup;
  res.render('index', { signup });
});

app.get('/signup', (req, res) => {
  const error = req.query.error;
  res.render('signup', { error });
});

app.post('/signup-process', (req, res) => {
  const { name, email, password, role } = req.body;
  const filePath = path.join(__dirname, 'data', role === 'teacher' ? 'teachers.csv' : 'students.csv');
  const userData = `${name},${email},${password}\n`;

  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err && err.code !== 'ENOENT') {
          console.error('Error reading CSV file', err);
          return res.status(500).send('Error signing up, please try again.');
      }

      if (data && data.includes(userData.trim())) {
          return res.redirect('/signup?error=exists');
      }

      fs.appendFile(filePath, userData, (err) => {
          if (err) {
              console.error('Error writing to CSV file', err);
              return res.status(500).send('Error signing up, please try again.');
          }
          res.redirect('/?signup=success');
      });
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