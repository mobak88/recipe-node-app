const { premium, admin } = require('./../variables/userType');

exports.validLogin = (req, res, next) => {
    const user = req.cookies.user_type;
    console.log(user);
    if (user !== premium || user !== admin) {
        return res.status(401).json("Not Unauthorized");
    }

    next();
};