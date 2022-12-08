/**
 * Function that checks if default recipes exists
 * If they exist it just moves on by calling next
 * If not creates default recipes
*/

const pool = require('../db');

exports.createDefaultRecipes = (async () => {
    try {
        const defaultFreeRecipes = require('../defaultRecipes.json');
        const recipes = await pool.query('SELECT * FROM recipe');

        if (recipes.rowCount < defaultFreeRecipes.length) {
            for (let index = 0; index < defaultFreeRecipes.length; index++) {
                await pool.query(
                    'INSERT INTO recipe (recipe_name, category) VALUES($1, $2) RETURNING *',
                    [defaultFreeRecipes[index].name, defaultFreeRecipes[index].category]
                );


                for (let i = 0; i < defaultFreeRecipes[index].ingredients.length; i++) {
                    await pool.query(
                        'INSERT INTO ingredient (fk_recipe, ingredient_name, ingredient_category) VALUES($1, $2, $3) RETURNING *',
                        [defaultFreeRecipes[index].ingredients[i].fk_recipe, defaultFreeRecipes[index].ingredients[i].entry, defaultFreeRecipes[index].ingredients[i].type]
                    );
                }

                for (let i = 0; i < defaultFreeRecipes[index].steps.length; i++) {
                    await pool.query(
                        'INSERT INTO step (fk_recipe, step_text) VALUES($1, $2) RETURNING *',
                        [defaultFreeRecipes[index].steps[i].fk_recipe, defaultFreeRecipes[index].steps[i].text]
                    );
                }
            }
        }
    } catch (err) {
        console.error(err.message);
    }
});