const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/routes', express.static(path.join(__dirname, 'routes')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signup', (req, res) => {
  res.render('signup');
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