/* This is the main entry point of the application */
const express = require('express');
const app = express();
const cors = require('cors');

const recipeRouter = require('./routes/recipeRoutes');

const url = process.env.URL || 'localhost';
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());

// Built-in middleware function in Express, parses incoming requests with JSON payloads
app.use(express.json()); // Access to req.body

// Imported routes to keep app file as small as possible
app.use('/', recipeRouter);

app.listen((port), () => {
    console.log(`App running on: http://${url}:${port}`);
});



