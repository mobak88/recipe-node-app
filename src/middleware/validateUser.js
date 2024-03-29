/**
 * Authorizing Middleware for search ingredient and search helper
 * checks if user is authorized for the endpoints
 * calls next if authorized
 * returns 401 response status if not authorized
*/

const { premium, admin } = require('../variables/userType');

const validateUser = (req, res, next) => {
    const user = req.cookies.user_type;

    if (user !== premium && user !== admin) {
        return res.status(401).json("Not Unauthorized");
    } else {
        next();
    }
};

module.exports = { validateUser };