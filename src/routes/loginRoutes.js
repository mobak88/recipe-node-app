/* Routes for login */
const express = require('express');
const loginController = require('./../controllers/loginController');
const router = express.Router();

router
    .route('/login')
    .post(loginController.login);

module.exports = router;