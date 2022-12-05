/* Route exported for search ingredient */
const express = require('express');
const searchController = require('./../controllers/searchControllers');
const { validateUser } = require('../middleware/validateUser');
const router = express.Router();

router
    .route('/search/:ingredient')
    .get(validateUser, searchController.searchIngredient);

module.exports = router;