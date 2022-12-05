/**
 * Checks if query.rows returns anything
 * if not send error msg
 * Takes query result and response as parameters
 * */

exports.checkIdExists = (item, res) => {
    // If not match id does not exist
    if (item.rows.length === 0) {
        res.status(404).json('Recipe not found');
        return;
    }
};