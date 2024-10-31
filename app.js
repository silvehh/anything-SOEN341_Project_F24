const express = require('express');
const path = require('path');
const { Pool } = require('pg'); // PostgreSQL client
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000; // Use the port provided by Railway or default to 3000

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // For SSL connections; adjust if necessary
});

// Test database connection at startup
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    process.exit(1); // Exit if the database connection fails
  } else {
    console.log('Connected to the database successfully.');
  }
});

// Middleware to parse incoming data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set view engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/routes', express.static(path.join(__dirname, 'routes')));

// Routes
app.get('/', (req, res) => res.render('index'));

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/student-login', (req, res) => {
  res.render('student-login');
});

app.get('/teacher-login', (req, res) => {
  res.render('teacher-login');
});

// Route to handle user signup
app.post('/signup', async (req, res) => {
  const { email, password, role } = req.body; // Assuming your signup form sends these fields

  try {
    // Insert user into the database
    await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
      [email, password, role]
    );
    res.send('User registered successfully!');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});