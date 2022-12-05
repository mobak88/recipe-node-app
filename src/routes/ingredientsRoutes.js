/* Route exported for search all ingredients */
const express = require('express');
const ingredientsController = require('../controllers/ingredientsController');
const { validateUser } = require('../middleware/validateUser');
const router = express.Router();

router
    .route('/ingredients')
    .get(validateUser, ingredientsController.getAllIngredients);

module.exports = router;