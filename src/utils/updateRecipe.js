/**
 * Extracted logic to functions to make controller smaller
 */

const pool = require('../db');

/**
 * check if ingredients array are provided
 * if ingredients array are provied iterates ingredient array
 * checks if ingredient object contains ingredient id
 * If ingredient object does not have id, creates new ingredient
 * If ingredient id are provided it will update ingredient name and or ingredient category if provided
 * takes ingredients array and recipe id as parameter
 */
const updateIngredients = async (ingredients, recipe_id, res) => {
    // Checking if ingredients are provided
    if (ingredients) {
        const allIngredients = await pool.query(
            'SELECT * FROM ingredient WHERE fk_recipe = $1',
            [recipe_id]
        );

        // Finding number of provided ingredients > ingredients for recipe in database
        const newIngredintsCount = ingredients.length - allIngredients.rowCount > 0 ? ingredients.length - allIngredients.rowCount : 0;

        // Iterating ingredients array if ingredients exist
        for (let i = 0; i < ingredients.length - newIngredintsCount; i++) {
            // If ingredient name provided update ingredient name with the provided id
            if (ingredients[i].ingredient_name) {
                await pool.query(
                    'UPDATE ingredient SET ingredient_name = $1 WHERE ingredient_id = $2',
                    [ingredients[i].ingredient_name, allIngredients.rows[i].ingredient_id]
                );
            }

            // If ingredient category provided update ingredient name with the provided id
            if (ingredients[i].ingredient_category) {
                await pool.query(
                    'UPDATE ingredient SET ingredient_category = $1 WHERE ingredient_id = $2',
                    [ingredients[i].ingredient_category, allIngredients.rows[i].ingredient_id]
                );
            }
        }

        // Executing only if provided ingredients > ingredients for recipe in database
        if (newIngredintsCount > 0) {
            // Creating new ingredient for each ingredient > ingredients for recipe in database
            for (let i = allIngredients.rowCount; i < allIngredients.rowCount + newIngredintsCount; i++) {
                if (!ingredients[i].ingredient_name || !ingredients[i].ingredient_category) {
                    return res.status(400).send('All new ingredients must have name and category');
                }

                await pool.query(
                    'INSERT INTO ingredient (fk_recipe, ingredient_name, ingredient_category) VALUES($1, $2, $3) RETURNING *',
                    [recipe_id, ingredients[i].ingredient_name, ingredients[i].ingredient_category]
                );
            }
        }
    }
};

/**
 * check if steps array are provided
 * if steps array are provied iterates steps array
 * checks if step object contains step id
 * If steps object does not have id, creates new step
 * If step id are provided it will update step text
 * takes steps array and recipe id as parameter
 */
const updateSTeps = async (steps, recipe_id) => {
    // Checking if steps are provided
    if (steps) {
        const allSteps = await pool.query(
            'SELECT * FROM step WHERE fk_recipe = $1',
            [recipe_id]
        );

        // Finding number of provided steps > steps for recipe in database
        const newStepsCount = steps.length - allSteps.rowCount > 0 ? steps.length - allSteps.rowCount : 0;

        // Iterating steps array if steps exists
        for (let i = 0; i < steps.length - newStepsCount; i++) {
            // If step text provided update step text with the provided id
            if (steps[i].step_text) {
                await pool.query(
                    'UPDATE step SET step_text = $1 WHERE step_id = $2',
                    [steps[i].step_text, allSteps.rows[i].step_id]
                );
            }
        }

        // Executing only if provided steps > steps for recipe in database
        if (newStepsCount > 0) {
            // Creating new step for each step > steps for recipe in database
            for (let i = allSteps.rowCount; i <= allSteps.rowCount - newStepsCount; i++) {
                if (!steps[i].step_text) {
                    return res.status(400).send('All steps needs step text');
                }

                await pool.query(
                    'INSERT INTO step (fk_recipe, step_text) VALUES($1, $2) RETURNING *',
                    [recipe_id, steps[i].step_text]
                );
            }
        }
    }
};

module.exports = { updateIngredients, updateSTeps }; 