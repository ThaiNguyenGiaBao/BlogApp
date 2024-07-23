const jwt = require('jsonwebtoken');

module.exports =  verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json('Unauthorized');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json('Unauthorized');
        }
        req.user = user;
        next();
    });
}