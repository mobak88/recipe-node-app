/* HTTP requests exported for search all ingredients */
const pool = require('../db');

// Get all recipes
exports.getAllIngredients = ('/ingredients', async (req, res) => {
    try {

        const ingredients = await pool.query('SELECT ingredient_category FROM ingredient');

        const data = {
            ingredients: ingredients.rows
        };

        return res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});