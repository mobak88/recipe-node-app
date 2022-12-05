const checkUserID = (req, res, next) => {
    const { recipe_id } = req.params;
    if (!isNaN(parseInt(recipe_id))) {
        return next();
    }
    res.status(422).json('Please use number');

};
module.exports = { checkUserID };