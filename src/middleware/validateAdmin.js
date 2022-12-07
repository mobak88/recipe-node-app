/**
 * Authorizing Middleware for admin
 * checks if user is authorized as an admin
 * returns 401 response status if not authorized
*/

const { admin } = require('../variables/userType');

const validateAdmin = (req, res, next) => {
    const user = req.cookies.user_type;

    if (user !== admin) {
        return res.status(401).json("Not Unauthorized");
    } else {
        next();
    }
};

module.exports = { validateAdmin };