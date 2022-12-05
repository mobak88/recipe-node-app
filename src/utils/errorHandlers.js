/* Functions that checks if req.params is number and exists, needs res to send error msg */
exports.checkIdIsNumber = (id, res) => {
    if (isNaN(parseInt(id))) {
        res.status(422).json('Please use number');
        return;
    }
};

/* Checks if query.rows returns anything, if not send error msg */
exports.checkIdExists = (item, res) => {
    // If not match id does not exist
    if (item.rows.length === 0) {
        res.status(404).json('Recipe not found');
        return;
    }
};