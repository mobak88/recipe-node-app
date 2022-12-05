/* HTTP requests exported for recipes */
const pool = require('../db');
const errorHandlers = require('./../utils/errorHandlers');

const { structureRecipe } = require('../utils/structureRecipe');
const { free, premium, admin } = require('./../variables/userType');

// Get all recipes
exports.getAllRecipes = ('/recipes', async (req, res) => {
    try {
        const user = req.cookies.user_type;

        if (user === premium || user === admin) {
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
        const user = req.cookies.user_type;

        let recipe;
        // Checking if user are premium or admin, making sql query acoridng to Authorization
        if (user === premium || user === admin) {
            // Using alias to differentiate tables with the same column name
            recipe = await pool.query('SELECT * FROM recipe JOIN ingredient AS ing ON recipe_id = ing.fk_recipe JOIN step AS stp ON recipe_id = stp.fk_recipe WHERE recipe_id = $1', [recipe_id]);
        } else {
            recipe = await pool.query('SELECT * FROM recipe JOIN ingredient AS ing ON recipe_id = ing.fk_recipe JOIN step AS stp ON recipe_id = stp.fk_recipe WHERE recipe_id = $1 AND category = $2', [recipe_id, free]);
        }

        errorHandlers.checkIdExists(recipe, res);

        if (recipe.rowCount > 0) {
            const { recipeName, steps, ingredients } = structureRecipe(recipe.rows);

            const data = {
                name: recipeName,
                category: recipe.rows[0].category,
                ingredients: ingredients,
                step_count: steps.length
            };

            res.json(data);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//Get a recipe with step details
exports.getAllRecipeDetails = ('/recipes/:recipe_id/all', async (req, res) => {
    try {
        const { recipe_id } = req.params;
        const user = req.cookies.user_type;

        let recipe;
        if (user === premium || user === admin) {
            // Using alias to differentiate tables with the same column name
            recipe = await pool.query('SELECT * FROM recipe JOIN ingredient AS ing ON recipe_id = ing.fk_recipe JOIN step AS stp ON recipe_id = stp.fk_recipe WHERE recipe_id = $1', [recipe_id]);
        } else {
            // Using alias to differentiate tables with the same column name
            recipe = await pool.query('SELECT * FROM recipe JOIN ingredient AS ing ON recipe_id = ing.fk_recipe JOIN step AS stp ON recipe_id = stp.fk_recipe WHERE recipe_id = $1 AND category = $2', [recipe_id, free]);
        }

        errorHandlers.checkIdExists(recipe, res);

        if (recipe.rowCount > 0) {
            const { recipeName, steps, ingredients } = structureRecipe(recipe.rows);

            const stepsWithStepCount = steps.map((step, i) => {
                return { step_id: step.step_id, step_number: i + 1, text: step.text.replaceAll('/', ' or ') };
            });

            const data = {
                name: recipeName,
                category: recipe.rows[0].category,
                ingredients: ingredients,
                steps: stepsWithStepCount
            };

            res.json(data);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get single step
exports.getSingleStep = ('/recipes/:recipe_id/:step_id', async (req, res) => {
    try {
        const { recipe_id, step_id } = req.params;
        const user = req.cookies.user_type;

        let steps;
        if (user === premium || user === admin) {
            steps = await pool.query('SELECT step_id, step_text, recipe_id, recipe_name FROM recipe JOIN step ON recipe_id = fk_recipe WHERE recipe_id = $1', [recipe_id]);
        } else {
            steps = await pool.query('SELECT step_id, step_text, recipe_id, recipe_name FROM recipe JOIN step ON recipe_id = fk_recipe WHERE recipe_id = $1 AND step_id = $2 AND category = $3', [recipe_id, step_id, free]);
        }

        if (step_id > steps.rowCount || step_id === 0) {
            res.status(404).json('Step does not exist');
            return;
        }

        const text = steps.rows[step_id - 1].step_text.replaceAll('/', ' or ');

        const data = {
            recipe_id: steps.rows[0].recipe_id,
            recipe_name: steps.rows[0].recipe_name,
            step_id: steps.rows[step_id - 1].step_id,
            step_number: parseInt(step_id),
            text: text
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});