/* This is the main entry point of the application */
const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

const defaultFreeRecipes = require('./defaultFreeRecipes.json');

const url = process.env.URL || 'localhost';
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // Access to req.body

app.get('/recipes/create/default', async (req, res) => {
    try {
        /* for (let i = 0; i < defaultFreeRecipes.length; i++) {
            await pool.query(
                'INSERT INTO recipe (recipe_name, category) VALUES($1, $2) RETURNING *',
                [defaultFreeRecipes[i].name, defaultFreeRecipes[i].category]
            );
        } */

        const [ingredients] = defaultFreeRecipes.ingredients;

        /* for (let i = 0; i < ingredients.length; i++) {
            await pool.query(
                'INSERT INTO ingredient (fk_recipe, ingredient_name, ingredient_category) VALUES($1, $2, $3) RETURNING *',
                [defaultFreeRecipes[i].name, defaultFreeRecipes[i].category]
            );
        } */

        res.json(ingredients);
    } catch (err) {
        console.error(err.message);
    }
});

app.get('/recipes', async (req, res) => {
    try {
        const recipes = await pool.query('SELECT * FROM recipe JOIN ingredient ON recipe_id = fk_recipe');

        res.json(recipes.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.listen((port), () => {
    console.log(`App running on: http://${url}:${port}`);
});