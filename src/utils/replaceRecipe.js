/**
 * Extracted logic to function because it made the controller huge
 * could have used callback function for returning error comnbined with 
 * brackets to be able to set object keys as parameters and make them one function,
 * but many people dont like callbacks
 */

/**
 * check if provided ingredients > or < than ingredients for recipe in database
 * if provided ingredients > udpates existing ingredients and creates new ingredients
 * in database for each extra ingredient provided
 * if ingredients < updates ingredients and deletes the rest of
 * the ingredints in the database for the recipe
 * takes ingredients array, recipe id and response as parameter
 * returns error if error gets triggered
 */
const pool = require('../db');

const replaceIngredients = async (recipe_id, ingredients, res) => {
    const allIngredients = await pool.query(
        'SELECT * FROM ingredient WHERE fk_recipe = $1',
        [recipe_id]
    );

    // Helper that returns error if error is triggered to avoid code duplication, takes index as parameter
    const returnErr = (i) => {
        if (!ingredients[i].ingredient_name || !ingredients[i].ingredient_category) {
            return res.status(400).send('All ingredients must have name and category');
        }
    };

    if (ingredients.length >= allIngredients.rowCount) {
        // Finding number of provided ingredients > ingredients for recipe in database
        const newIngredintsCount = ingredients.length - allIngredients.rowCount;

        // Iterating arrays and excecuting query per object in array
        for (let i = 0; i < ingredients.length - newIngredintsCount; i++) {
            returnErr(i);

            await pool.query(
                'UPDATE ingredient SET ingredient_name = $1, ingredient_category = $2 WHERE ingredient_id = $3',
                [ingredients[i].ingredient_name, ingredients[i].ingredient_category, allIngredients.rows[i].ingredient_id]
            );
        }

        // Executing only if provided ingredients > ingredients for recipe in database
        if (newIngredintsCount > 0) {
            // Creating new ingredient for each ingredient > ingredients for recipe in database
            for (let i = 0; i < newIngredintsCount; i++) {
                returnErr(i);

                await pool.query(
                    'INSERT INTO ingredient (fk_recipe, ingredient_name, ingredient_category) VALUES($1, $2, $3) RETURNING *',
                    [recipe_id, ingredients[i].ingredient_name, ingredients[i].ingredient_category]
                );
            }
        }
    }

    if (ingredients.length < allIngredients.rowCount) {
        // Finding number of provided ingredients < ingredients for recipe in database
        const deleteIngredientCount = allIngredients.rowCount - ingredients.length;

        // Iterating arrays and excecuting query per object in array
        for (let i = 0; i < ingredients.length - deleteIngredientCount; i++) {
            returnErr(i);

            await pool.query(
                'UPDATE ingredient SET ingredient_name = $1, ingredient_category = $2 WHERE ingredient_id = $3',
                [ingredients[i].ingredient_name, ingredients[i].ingredient_category, allIngredients.rows[i].ingredient_id]
            );
        }

        for (let i = 0; i < deleteIngredientCount; i++) {
            returnErr(i);

            await pool.query(
                'DELETE FROM ingredient WHERE ingredient_id = $1',
                [allIngredients.rows[i].ingredient_id]
            );
        }
    }
};

/**
 * Does the exact same thing as the above function but with step
 * takes steps array, recipe id and response as parameter
 * returns error if error gets triggered
 */
const replaceSteps = async (recipe_id, steps, res) => {
    const allSteps = await pool.query(
        'SELECT * FROM step WHERE fk_recipe = $1',
        [recipe_id]
    );

    const returnErr = (i) => {
        if (!steps[i].step_text) {
            return res.status(400).send('All steps needs step text');
        }
    };

    if (steps.length >= allSteps.rowCount) {
        // Finding number of provided steps > steps for recipe in database
        const newStepsCount = steps.length - allSteps.rowCount;

        // Iterating arrays and excecuting query per object in array
        for (let i = 0; i < steps.length - newStepsCount; i++) {
            returnErr(i);

            await pool.query(
                'UPDATE step SET step_text = $1 WHERE step_id = $2',
                [steps[i].step_text, allSteps.rows[i].step_id]
            );
        }

        // Executing only if provided steps > steps for recipe in database
        if (newStepsCount > 0) {
            // Creating new step for each step > steps for recipe in database
            for (let i = 0; i < newStepsCount; i++) {
                returnErr(i);

                await pool.query(
                    'INSERT INTO step (fk_recipe, step_text) VALUES($1, $2) RETURNING *',
                    [recipe_id, steps[i].step_text]
                );
            }
        }
    }

    if (steps.length < allSteps.rowCount) {
        // Finding number of provided steps < steps for recipe in database
        const deleteStepsCount = allSteps.rowCount - steps.length;

        // Iterating arrays and excecuting query per object in array
        for (let i = 0; i < steps.length - deleteStepsCount; i++) {
            returnErr(i);

            await pool.query(
                'UPDATE step SET step_text = $1 WHERE step_id = $2',
                [steps[i].step_text, allSteps.rows[i].step_id]
            );
        }

        for (let i = 0; i < deleteStepsCount; i++) {
            returnErr(i);

            await pool.query(
                'DELETE FROM step WHERE step_id = $1',
                [allSteps.rows[i].step_id]
            );
        }
    }
};

module.exports = { replaceIngredients, replaceSteps };