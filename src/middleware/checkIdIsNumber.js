/**
 * Middleware that checks if params is number and exists
 * Calls next if conditions are met
*/

const checkIdIsNumber = (req, res, next) => {
    const { recipe_id, step_id } = req.params;

    // Helper function checks if recipe id or step id contains digits only, returns char if it contains non numeric value
    const containsString = (id) => id?.split('').find(letter => {
        if (/^[0-9]+$/.test(letter)) {
            return false;
        } else {
            return true;
        }
    });

    const checkRecipeId = containsString(recipe_id);
    const checkStepId = containsString(step_id);

    if (step_id && checkStepId) {
        return res.status(422).json('Please use number');
    }

    if (checkRecipeId) {
        return res.status(422).json('Please use number');
    } else {
        return next();
    }
};

module.exports = { checkIdIsNumber };