/**
 * Login controller
 * setting cookie to premium or admin if it is provided in req.body
 * */

exports.login = ('/login', async (req, res) => {
    try {
        const { user_type } = req.body;

        if (user_type === 'premium') {
            res.cookie(`user_type`, `${user_type}`);
        } else if (user_type === 'admin') {
            res.cookie(`user_type`, `${user_type}`);
        }

        console.log(req.body);

        res.json(user_type);
    } catch (err) {
        console.error(err.message);
    }
});