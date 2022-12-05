/**
 * Middleware that checks if params is number and exists
 * Calls next if conditions are met
 * */

const checkIdIsNumber = (req, res, next) => {
    const { recipe_id, step_id } = req.params;

    if (step_id && isNaN(parseInt(step_id))) {
        return res.status(422).json('Please use number');
    }

    if (isNaN(parseInt(recipe_id))) {
        return res.status(422).json('Please use number');
    } else {
        return next();
    }

};

module.exports = { checkIdIsNumber };