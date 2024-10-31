const express = require('express');
const path = require('path');
const { Pool } = require('pg'); 
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 8080; // Use Railway’s dynamic port

console.log('PORT from environment:', PORT); // Debugging port usage

// PostgreSQL connection pool with optimized settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Wait 2 seconds for a connection
  max: 5 // Limit the number of clients in the pool
});

// Error handling for idle clients
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err);
  process.exit(-1); // Exit the process on error to avoid issues
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

// Test DB connection route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).send(`Database time: ${result.rows[0].now}`);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Database connection error');
  }
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