/**
 * Authorizing Middleware for admin
 * checks if user is authorized as an admin
 * */

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