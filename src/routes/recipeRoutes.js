/* Routes exported for recipes */
const express = require('express');
const recipeController = require('./../controllers/recipeControllers');
const { checkIdIsNumber } = require('./../middleware/checkIdIsNumber');
const { validateAdmin } = require('./../middleware/validateAdmin');
const router = express.Router();

router
    .route('/recipes')
    .get(recipeController.getAllRecipes)
    .post(validateAdmin, recipeController.postRecipe);

router
    .route('/recipes/:recipe_id')
    .get(checkIdIsNumber, recipeController.getRecipe)
    .patch(validateAdmin, checkIdIsNumber, recipeController.updateRecipe)
    .put(validateAdmin, checkIdIsNumber, recipeController.replaceRecipe)
    .delete(validateAdmin, checkIdIsNumber, recipeController.deleteRecipe);

router
    .route('/recipes/:recipe_id/all')
    .get(checkIdIsNumber, recipeController.getAllRecipeDetails);

router
    .route('/recipes/:recipe_id/steps/:step_count')
    .get(checkIdIsNumber, recipeController.getSingleStepByCount);

module.exports = router;