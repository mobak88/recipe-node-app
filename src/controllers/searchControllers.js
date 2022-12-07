/* HTTP requests exported for search ingredient */
const pool = require('../db');

// Get all recipes with ingredient
exports.searchIngredient = ('/search/:ingredient', async (req, res) => {
    try {
        const { ingredient } = req.params;

        recipes = await pool.query('SELECT recipe_id FROM recipe JOIN ingredient ON recipe_id = fk_recipe WHERE ingredient_category = $1', [ingredient]);


        if (recipes.rows.length < 1) {
            res.json('No recipes found');
            return;
        }

        const recipeStringsArr = recipes.rows.map(recipe => `/recipe/${recipe.recipe_id}`);

        const data = {
            search: ingredient,
            results: recipeStringsArr
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});