/**
 * Login controller
 * setting cookie to premium or admin if it is provided in req.body
 * returns 401 response status if error gets triggered
*/

const { premium, admin } = require('./../variables/userType');

exports.login = ('/login', async (req, res) => {
    try {
        const { user_type } = req.body;
        const user = req.cookies.user_type;

        if (user_type === admin && user === admin) {
            return res.status(401).json('Already logged in');
        }

        if (user_type === premium && user === premium) {
            return res.status(401).json('Already logged in');
        }

        if (user_type === premium) {
            res.cookie(`user_type`, `${user_type}`);
            return res.json(`${premium} logged in`);
        } else if (user_type === admin) {
            res.cookie(`user_type`, `${user_type}`);
            return res.json(`${admin} logged in`);
        } else {
            return res.status(401).json("Invalid or missing credentials");
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});