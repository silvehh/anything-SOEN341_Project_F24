const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.ejs file on the root route
app.get('/', (req, res) => {
    res.render('index'); // Renders views/index.ejs
});

app.get('/signup', (req, res) => {
  res.render('signup');  // Will render 'signup.ejs'
});

app.get('/student-login', (req, res) => {
  res.render('student-login');
});

app.get('/teacher-login', (req, res) => {
  res.render('teacher-login');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
