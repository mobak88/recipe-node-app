const { premium, admin } = require('./../variables/userType');

const validateUser = (req, res, next) => {
    const user = req.cookies.user_type;

    if (user !== premium || user !== admin) {
        return res.status(401).json("Not Unauthorized");
    }

    next();
};

module.exports = { validateUser };