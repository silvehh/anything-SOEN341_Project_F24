const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const csvWriter = createCsvWriter({
  path: 'users.csv',
  header: [
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' },
    { id: 'password', title: 'Password' }, 
    { id: 'role', title: 'Role' }
  ],
  append: true 
});

app.post('/signup-process', (req, res) => {
  const { name, email, password, role } = req.body;

  csvWriter.writeRecords([{ name, email, password, role }])
    .then(() => {
      console.log('Credentials saved to users.csv');
      res.send('Signup successful!');
    })
    .catch(err => {
      console.error('Error writing to CSV:', err);
      res.status(500).send('Internal server error');
    });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/sign-up.html');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
