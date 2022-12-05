/* This is the main entry point of the application */
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { createDefaultRecipes } = require('./utils/createDefeaultRecipes');

const recipeRouter = require('./routes/recipeRoutes');
const loginRoutes = require('./routes/loginRoutes');
const searchIngredientRouter = require('./routes/searchRouter');

const url = process.env.URL || 'localhost';
const port = process.env.PORT || 8080;

// Middleware that can be used to enable CORS with various options
app.use(cors());

// Middleware that let’s you use the cookieParser in your application
app.use(cookieParser());

// Built-in middleware function in Express, parses incoming requests with JSON payloads
app.use(express.json()); // Access to req.body

// Imported routes to keep app file as small as possible
app.use('/', recipeRouter);
app.use('/', loginRoutes);
app.use('/', searchIngredientRouter);


app.listen((port), () => {
    console.log(`App running on: http://${url}:${port}`);
})




