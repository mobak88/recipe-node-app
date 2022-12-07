/**
 * Extracted logic to functions to make controller smaller
 */

const pool = require('../db');

const updateIngredients = async (ingredients, recipe_id) => {
    // Checking if ingredients are provided
    if (ingredients) {
        // Iterating ingredients array if ingredients exist
        for (let i = 0; i < ingredients.length; i++) {
            // If ingredient does not have id, create new ingredient
            if (!ingredients[i].ingredient_id) {
                await pool.query(
                    'INSERT INTO ingredient (fk_recipe, ingredient_name, ingredient_category) VALUES($1, $2, $3) RETURNING *',
                    [recipe_id, ingredients[i].ingredient_name, ingredients[i].ingredient_category]
                );
            }

            // If ingredient name provided update ingredient name with the provided id
            if (ingredients[i].ingredient_name) {
                await pool.query(
                    'UPDATE ingredient SET ingredient_name = $1 WHERE ingredient_id = $2',
                    [ingredients[i].ingredient_name, ingredients[i].ingredient_id]
                );
            }

            // If ingredient category provided update ingredient name with the provided id
            if (ingredients[i].ingredient_category) {
                await pool.query(
                    'UPDATE ingredient SET ingredient_category = $1 WHERE ingredient_id = $2',
                    [ingredients[i].ingredient_category, ingredients[i].ingredient_id]
                );
            }
        }
    }
};

const updateSTeps = async (steps, recipe_id) => {
    // Checking if steps are provided
    if (steps) {
        // Iterating steps array if steps exists
        for (let i = 0; i < steps.length; i++) {
            // If step does not have id, create new step
            if (!steps[i].step_id) {
                await pool.query(
                    'INSERT INTO step (fk_recipe, step_text) VALUES($1, $2) RETURNING *',
                    [recipe_id, steps[i].step_text]
                );
            }

            // If step text provided update step text with the provided id
            if (steps[i].step_text) {
                await pool.query(
                    'UPDATE step SET step_text = $1 WHERE step_id = $2',
                    [steps[i].step_text, steps[i].step_id]
                );
            }
        }
    }
};

module.exports = { updateIngredients, updateSTeps }; 