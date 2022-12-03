/* HTTP requests exported for recipes */
const pool = require('../db');
const errorHandlers = require('./../utils/errorHandlers');
const { structureRecipe } = require('./../utils/structurerecipe');

const free = 'free';
const premium = 'premium';

// Get all recipes
exports.getAllRecipes = ('/recipes', async (req, res) => {
    try {
        const recipes = await pool.query('SELECT * FROM recipe WHERE category = $1', [free]);

        res.json(recipes.rows);
    } catch (err) {
        console.error(err.message);
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
    }
});

// Create default recipes, if default recipes do not exist
exports.createDefaultRecipes = ('/recipes/create/default', async (req, res) => {
    try {
        const defaultFreeRecipes = require('./../defaultRecipes.json');
        const recipes = await pool.query('SELECT * FROM recipe');

        if (recipes.rows.length === 6) {
            return res.json('Default recipes alredy exists');
        } else {
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
        }

        res.json(defaultFreeRecipes);
    } catch (err) {
        console.error(err.message);
    }
});