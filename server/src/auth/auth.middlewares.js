const jwt = require('jsonwebtoken');

const schema = require('./auth.schema');
const users = require('./auth.model');

function checkTokenSetUser(req, res, next) {
    const authHeader = req.get('Authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            // use the jwt library to decode the token
            jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
                if (error) {
                    console.log(error);
                }
                req.user = user;
                next();
            });
        } else {
            next();
        }
    } else {
        next();
    }
}

function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else unAuthorized(res, next);
}

function unAuthorized(res, next) {
    const error = new Error('Sorry, you are un-authorized');
    res.status(401);
    next(error);
}

module.exports = {
    checkTokenSetUser,
    isLoggedIn,
};