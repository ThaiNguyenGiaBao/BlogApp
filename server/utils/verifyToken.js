const jwt = require('jsonwebtoken');

module.exports =  verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //console.log(req.body)
    if (!token) {
        return res.status(401).json('Unauthorized');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json('Error in verifying token');
        }
        req.user = user;
        console.log(user)
        next();
    });
}