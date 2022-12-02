/* This is the main entry point of the application */
const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

const url = process.env.URL || 'localhost';
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // Access to req.body

app.listen((port), () => {
    console.log(`App running on: http://${url}:${port}`);
});