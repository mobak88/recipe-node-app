/* Route exported for search ingredient */
const express = require('express');
const searchController = require('./../controllers/searchControllers');
const { validLogin } = require('./../middleware/validLogin');
const router = express.Router();

router
    .route('/search/:ingredient')
    .get(validLogin, searchController.searchIngredient);

module.exports = router;