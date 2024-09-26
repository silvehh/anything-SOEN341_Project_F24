const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve the index.ejs file on the root route
app.get('/', (req, res) => {
    res.render('index'); // Renders views/index.ejs
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
