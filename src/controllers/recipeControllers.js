/* HTTP requests exported for recipes */
const pool = require('../db');
const errorHandlers = require('./../utils/errorHandlers');

const { structureRecipe } = require('../utils/structureRecipe');
const { free, premium, admin } = require('./../variables/userType');

// Get all recipes
exports.getAllRecipes = ('/recipes', async (req, res) => {
    try {
        const user = req.cookies.user_type;

        let recipes;
        // Checking if user are premium or admin, making sql query acording to Authorization
        if (user === premium || user === admin) {
            recipes = await pool.query('SELECT * FROM recipe');
        } else {
            recipes = await pool.query('SELECT * FROM recipe WHERE category = $1', [free]);
        }

        const data = {
            recipes: recipes.rows
        };

        res.json(data);
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
        // Checking if user are premium or admin, making sql query acording to Authorization
        if (user === premium || user === admin) {
            // Using alias to differentiate tables with the same column name
            recipe = await pool.query('SELECT * FROM recipe JOIN ingredient AS ing ON recipe_id = ing.fk_recipe JOIN step AS stp ON recipe_id = stp.fk_recipe WHERE recipe_id = $1', [recipe_id]);
        } else {
            recipe = await pool.query('SELECT * FROM recipe JOIN ingredient AS ing ON recipe_id = ing.fk_recipe JOIN step AS stp ON recipe_id = stp.fk_recipe WHERE recipe_id = $1 AND category = $2', [recipe_id, free]);
        }

        const returnErrStatus = errorHandlers.checkIdExists(recipe, res);

        // Returning if error exist
        if (returnErrStatus) {
            return;
        }

        const { recipeName, steps, ingredients } = structureRecipe(recipe.rows);

        const data = {
            name: recipeName,
            category: recipe.rows[0].category,
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
        const user = req.cookies.user_type;

        let recipe;
        // Checking if user are premium or admin, making sql query acording to Authorization
        if (user === premium || user === admin) {
            // Using alias to differentiate tables with the same column name
            recipe = await pool.query('SELECT * FROM recipe JOIN ingredient AS ing ON recipe_id = ing.fk_recipe JOIN step AS stp ON recipe_id = stp.fk_recipe WHERE recipe_id = $1', [recipe_id]);
        } else {
            recipe = await pool.query('SELECT * FROM recipe JOIN ingredient AS ing ON recipe_id = ing.fk_recipe JOIN step AS stp ON recipe_id = stp.fk_recipe WHERE recipe_id = $1 AND category = $2', [recipe_id, free]);
        }

        const returnErrStatus = errorHandlers.checkIdExists(recipe, res);

        if (returnErrStatus) {
            return;
        }

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
        // Checking if user are premium or admin, making sql query acording to Authorization
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
            step: {
                step_id: steps.rows[step_id - 1].step_id,
                step_number: parseInt(step_id),
                text: text,
                recipe: {
                    recipe_id: steps.rows[0].recipe_id,
                    recipe_name: steps.rows[0].recipe_name,
                }
            }
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Post recipe
exports.postRecipe = ('/recipes', async (req, res) => {
    try {
        const { recipe_name, category, ingredients, steps } = req.body;

        const returnErrStatus = errorHandlers.checkPostRecipe(res, recipe_name, category, ingredients, steps);

        if (returnErrStatus) {
            return;
        }

        const newRecipe = await pool.query('INSERT INTO recipe (recipe_name, category) VALUES($1, $2) RETURNING *', [recipe_name, category]);

        // Iterating arrays and excecuting query per object in array
        for (let i = 0; i < ingredients.length; i++) {
            await pool.query(
                'INSERT INTO ingredient (fk_recipe, ingredient_name, ingredient_category) VALUES($1, $2, $3) RETURNING *',
                [newRecipe.rows[0].recipe_id, ingredients[i].ingredient_name, ingredients[i].ingredient_category]
            );
        }

        for (let i = 0; i < steps.length; i++) {
            await pool.query(
                'INSERT INTO step (fk_recipe, step_text) VALUES($1, $2) RETURNING *',
                [newRecipe.rows[0].recipe_id, steps[i].step_text]
            );
        }

        res.status(201).send(`Recipe ${newRecipe.rows[0].recipe_name} was created with id: ${newRecipe.rows[0].recipe_id}`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update recipe
exports.updateRecipe = ('/recipes/:recipe_id', async (req, res) => {
    try {
        const { recipe_id } = req.params;
        const { recipe_name, category, ingredients, steps } = req.body;
        const { updateIngredients, updateSTeps } = require('./../utils/updateRecipe');


        // CHecking if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(204).json('No data in body');
        }

        // Checking if recipe name are provided, updating if true
        if (recipe_name) {
            await pool.query(
                'UPDATE recipe SET recipe_name = $1 WHERE recipe_id = $2',
                [recipe_name, recipe_id]
            );
        }

        // Checking if category are provided, updating if true
        if (category) {
            await pool.query(
                'UPDATE recipe SET category = $1 WHERE recipe_id = $2',
                [category, recipe_id]
            );
        }

        updateIngredients(ingredients, recipe_id);
        updateSTeps(steps, recipe_id);

        res.send(`Recipe with id: ${recipe_id} successfully updated`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Replace recipe
exports.replaceRecipe = ('/recipes/:recipe_id', async (req, res) => {
    try {
        const { replaceIngredients, replaceSteps } = require('./../utils/replaceRecipe');
        const { recipe_id } = req.params;
        const { recipe_name, category, ingredients, steps } = req.body;

        if (!recipe_name) {
            return res.status(400).send('Cant delete recipe name because of relations');
        }

        if (!category || category !== free && category !== premium) {
            return res.status(400).send('Recipe category must be spesified as free or premium');
        }

        await pool.query(
            'UPDATE recipe SET recipe_name = $1, category = $2 WHERE recipe_id = $3',
            [recipe_name, category, recipe_id]
        );

        const ingredintErr = await replaceIngredients(recipe_id, ingredients, res);

        if (ingredintErr) {
            return;
        }

        const stepErr = await replaceSteps(recipe_id, steps, res);

        if (stepErr) {
            return;
        }

        res.send(`Recipe with id: ${recipe_id} successfully updated`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

exports.deleteRecipe = ('/recipes/:recipe_id', async (req, res) => {
    try {
        const { recipe_id } = req.params;

        await pool.query(
            'DELETE FROM ingredient WHERE fk_recipe = $1',
            [recipe_id]
        );

        await pool.query(
            'DELETE FROM step WHERE fk_recipe = $1',
            [recipe_id]
        );

        await pool.query(
            'DELETE FROM recipe WHERE recipe_id = $1',
            [recipe_id]
        );

        res.send(`Recipe with id: ${recipe_id} successfully deleted`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});