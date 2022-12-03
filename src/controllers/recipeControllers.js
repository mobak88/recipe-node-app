/* HTTP requests exported for recipes */
const pool = require('../db');
const errorHandlers = require('./../utils/errorHandlers');
const { structureRecipe } = require('../utils/structureRecipe');

const free = 'free';
const premium = 'premium';

// Get all recipes
exports.getAllRecipes = ('/recipes', async (req, res) => {
    try {
        const user = req.cookies.user_type;

        if (user === premium) {
            const recipes = await pool.query('SELECT * FROM recipe');

            return res.json(recipes.rows);
        }

        const recipes = await pool.query('SELECT * FROM recipe WHERE category = $1', [free]);

        res.json(recipes.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//Get a recipe
exports.getRecipe = ('/recipes/:recipe_id', async (req, res) => {
    try {
        const { recipe_id } = req.params;

        errorHandlers.checkIdIsNumber(recipe_id, res);

        // Using alias to differentiate tables with the same column name
        const recipe = await pool.query('SELECT * FROM recipe JOIN ingredient AS ing ON recipe_id = ing.fk_recipe JOIN step AS stp ON recipe_id = stp.fk_recipe WHERE recipe_id = $1 AND category = $2', [recipe_id, free]);

        errorHandlers.checkIdExists(recipe, res);

        const { recipeName, steps, ingredients } = structureRecipe(recipe.rows);

        const data = {
            name: recipeName,
            ingredients: ingredients,
            step_count: steps.length
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//Get a recipe with step details
exports.getAllRecipeDetails = ('/recipes/:recipe_id/all', async (req, res) => {
    try {
        const { recipe_id } = req.params;

        errorHandlers.checkIdIsNumber(recipe_id, res);

        // Using alias to differentiate tables with the same column name
        const recipe = await pool.query('SELECT * FROM recipe JOIN ingredient AS ing ON recipe_id = ing.fk_recipe JOIN step AS stp ON recipe_id = stp.fk_recipe WHERE recipe_id = $1 AND category = $2', [recipe_id, free]);

        errorHandlers.checkIdExists(recipe, res);

        const { recipeName, steps, ingredients } = structureRecipe(recipe.rows);

        const data = {
            name: recipeName,
            ingredients: ingredients,
            steps: steps
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get single step
exports.getSingleStep = ('/recipes/:recipe_id/:step_id', async (req, res) => {
    try {
        const { recipe_id, step_id } = req.params;

        errorHandlers.checkIdIsNumber(recipe_id, res);
        errorHandlers.checkIdIsNumber(step_id, res);

        const recipe = await pool.query('SELECT step_id, step_text FROM recipe JOIN step ON recipe_id = fk_recipe WHERE recipe_id = $1 AND step_id = $2 AND category = $3 ', [recipe_id, step_id, free]);

        errorHandlers.checkIdExists(recipe, res);

        res.json(recipe.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});