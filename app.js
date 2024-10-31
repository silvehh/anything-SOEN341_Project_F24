const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/routes', express.static(path.join(__dirname, 'routes')));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
      secret: 'veeeerrrryyyyyyyy_secure_key',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
  })
);

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

app.post('/teacher-login', (req, res) => {
  const { email, password } = req.body;
  const filePath = path.join(__dirname, 'data', 'teachers.csv');

  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading CSV file', err);
          return res.status(500).send('An error occurred, please try again.');
      }

      const lines = data.split('\n');
      const found = lines.some(line => {
          const [name, storedEmail, storedPassword] = line.split(',');
          if (storedEmail === email && storedPassword.trim() === password) {
              req.session.teacher = { name, email };
              return true;
          }
          return false;
      });

      if (found) {
          res.redirect('/teacher-initial');
      } else {
          res.redirect('/teacher-login?error=invalid_credentials');
      }
  });
});

app.get('/teacher-initial', (req, res) => {
  if (!req.session.teacher) {
      return res.redirect('/teacher-login?error=unauthorized');
  }

  // Pass user-specific data to teacher-initial.ejs
  res.render('teacher-initial', { teacher: req.session.teacher });
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).send('Failed to log out.');
      }
      res.redirect('/teacher-login');
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});