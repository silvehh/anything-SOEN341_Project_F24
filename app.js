const express = require('express');
const path = require('path');
const { Pool } = require('pg'); 
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 8080; // Use Railway’s dynamic port

console.log('PORT from environment:', PORT); // Debugging port usage

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Check database connection at startup
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    process.exit(1); // Exit the process if DB connection fails
  } else {
    console.log('Connected to the database successfully.');
  }
});

// Set view engine and middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/routes', express.static(path.join(__dirname, 'routes')));

// Middleware to parse incoming data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home route
app.get('/', (req, res) => res.render('index'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('App is healthy!');
});

// POST route to submit a rating
app.post('/submit-rating', async (req, res) => {
  const { evaluator_id, evaluatee_id, team_name, cooperation, conceptual, practical, work_ethic, comments } = req.body;

  try {
    await pool.query(
      'INSERT INTO Ratings (team_name, evaluator_id, evaluatee_id, cooperation, conceptual, practical, work_ethic, comments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [team_name, evaluator_id, evaluatee_id, cooperation, conceptual, practical, work_ethic, comments]
    );
    res.send('Rating submitted successfully!');
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).send('Error submitting rating');
  }
});

// Handle graceful shutdowns to prevent crashes
process.on('SIGTERM', () => {
  console.log('Process received SIGTERM, shutting down gracefully.');
  pool.end(() => {
    console.log('Database pool closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Process received SIGINT, shutting down gracefully.');
  pool.end(() => {
    console.log('Database pool closed.');
    process.exit(0);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});