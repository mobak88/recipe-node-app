/**
 * Checks if query.rows returns anything
 * if not send error msg
 * Takes query result and response as parameters
 * */

exports.checkIdExists = (item, res) => {
    // If not match id does not exist
    if (item.rows.length === 0) {
        return res.status(404).json('Recipe not found');
    }
};

/**
 * Checking if data is valid
 * sending apropriate status code, messages and returning if not valid
 * Takes response, recipe name, category ingredients and steps as parameters
 * Returns response with error code and message
 * Its not very reusable, it exists to not clutter the controller
 * */
exports.checkPostRecipe = (res, recipe_name, category, ingredients, steps) => {
    if (!recipe_name) {
        return res.status(400).send('Recipe name missing');
    }

    if (!category) {
        return res.status(400).send('Category missing');
    }

    if (!Array.isArray(ingredients) || !Array.isArray(steps)) {
        return res.status(400).send('Ingredients and steps needs to be an array of objects');
    }

    const checkIfIngredientsAreObjects = ingredients.find(ingredient => {
        if (!ingredient.ingredient_name || !ingredient.ingredient_category) {
            return true;
        }
    });

    if (checkIfIngredientsAreObjects) {
        return res.status(400).send('Ingredient name and category must be provided as an object');
    }

    const checkIfStepsAreObjects = steps.find(step => {
        if (!step.step_text) {
            return true;
        }
    });

    if (checkIfStepsAreObjects) {
        return res.status(400).send('Step text must be provided as an object');
    }
};