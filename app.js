const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Set up CSV writer
const csvWriter = createCsvWriter({
  path: 'users.csv',
  header: [
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' },
    { id: 'password', title: 'Password' },  // Make sure to hash passwords in real scenarios
    { id: 'role', title: 'Role' }
  ],
  append: true
});

// Route handling (simplified)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/student-login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'student-login.html')));
app.get('/teacher-login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'teacher-login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'views', 'sign up.html')));

app.post('/signup-process', (req, res) => {
  const { name, email, password, role } = req.body;
  csvWriter.writeRecords([{ name, email, password, role }])
    .then(() => res.send('Signup successful!'))
    .catch(err => res.status(500).send('Error saving data'));
});

app.listen(port, () => console.log(`App running on http://localhost:${port}`));
