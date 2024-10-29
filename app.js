const express = require('express');
const path = require('path');
const { Pool } = require('pg'); // PostgreSQL client
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8080;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
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
    console.error(error);
    res.status(500).send('Error submitting rating');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});