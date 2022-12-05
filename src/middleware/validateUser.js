const { premium, admin } = require('../variables/userType');

/**
 * Authorizing Middleware for search ingredient and search helper
 * checks if user is authorized for the endpoints
 * */

const validateUser = (req, res, next) => {
    const user = req.cookies.user_type;

    console.log(user !== premium);

    if (user !== premium && user !== admin) {
        return res.status(401).json("Not Unauthorized");
    } else {
        next();
    }
};

module.exports = { validateUser };