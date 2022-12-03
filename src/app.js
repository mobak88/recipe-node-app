/* This is the main entry point of the application */
const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

const defaultFreeRecipes = require('./defaultRecipes.json');

const url = process.env.URL || 'localhost';
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // Access to req.body

app.get('/recipes/create/default', async (req, res) => {
    try {
        for (let index = 0; index < defaultFreeRecipes.length; index++) {
            await pool.query(
                'INSERT INTO recipe (recipe_name, category) VALUES($1, $2) RETURNING *',
                [defaultFreeRecipes[index].name, defaultFreeRecipes[index].category]
            );


            for (let i = 0; i < defaultFreeRecipes[index].ingredients.length; i++) {
                await pool.query(
                    'INSERT INTO ingredient (fk_recipe, ingredient_name, ingredient_category) VALUES($1, $2, $3) RETURNING *',
                    [defaultFreeRecipes[index].ingredients[i].fk_recipe, defaultFreeRecipes[index].ingredients[i].entry, defaultFreeRecipes[index].ingredients[i].type]
                );
            }

            for (let i = 0; i < defaultFreeRecipes[index].steps.length; i++) {
                await pool.query(
                    'INSERT INTO step (fk_recipe, step_text) VALUES($1, $2) RETURNING *',
                    [defaultFreeRecipes[index].steps[i].fk_recipe, defaultFreeRecipes[index].steps[i].text]
                );
            }
        }

        res.json(defaultFreeRecipes);
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



