const checkIdIsNumber = (req, res, next) => {
    const { recipe_id, step_id } = req.params;

    if (isNaN(parseInt(recipe_id)) || step_id.length > 0 && isNaN(parseInt(step_id))) {
        return res.status(422).json('Please use number');
    } else {
        return next();
    }

};
module.exports = { checkIdIsNumber };