/* Routes exported for recipes */
const express = require('express');
const recipeController = require('./../controllers/recipeControllers');
const { checkUserID } = require('./../middleware/checkIdIsNumber');
const router = express.Router();

router
    .route('/recipes')
    .get(recipeController.getAllRecipes);

router
    .route('/recipes/:recipe_id')
    .get(checkUserID, recipeController.getRecipe);

router
    .route('/recipes/:recipe_id/all')
    .get(recipeController.getAllRecipeDetails);

router
    .route('/recipes/:recipe_id/:step_id')
    .get(recipeController.getSingleStep);

module.exports = router;