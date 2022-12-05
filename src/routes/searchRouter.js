/* Route exported for search ingredient */
const express = require('express');
const searchController = require('./../controllers/searchControllers');
const router = express.Router();

router
    .route('/search/:ingredient')
    .get(searchController.searchIngredient);

module.exports = router;