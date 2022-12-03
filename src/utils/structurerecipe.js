/**
 * Creating function for recipe and recipe with all details
 * Takes recipe.rows as parameter
 * Creates unique arrays (sets) for ingredients and steps
 * Calls filteredIngredients passes recipe.rows and sets to it
 * Returns recipe name, ingredients and steps as an array of objects 
 * */

const { filterUniqueItems } = require('./filterUniqueItems');

exports.structureRecipe = (recipe) => {
    const recipeName = recipe[0].recipe_name;

    const ingredientsSet = new Set();
    const stepsSet = new Set();

    const filteredIngredients = filterUniqueItems(recipe, ingredientsSet, 'ingredient_id');
    const filteredSteps = filterUniqueItems(recipe, stepsSet, 'step_id');

    //Return array of objects with unique ingredients
    const ingredients = filteredIngredients.map(ing => {
        return { entry: ing.ingredient_name, type: ing.ingredient_category };
    });

    const steps = filteredSteps.map(step => {
        return { step_id: step.step_id, text: step.step_text };
    });

    const details = { recipeName, steps, ingredients };
    return details;
};