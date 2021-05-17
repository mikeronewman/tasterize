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

const validateUser = (defaultErrorMessage = '') => (req, res, next) => {
    const result = schema.validate(req.body);
    if (!result.error) {
        next();
    } else {
        const error = defaultErrorMessage ? new Error(defaultErrorMessage) : result.error;
        res.status(422);
        next(error);
    }
};

const findUser = (defaultLoginError, isError, errorCode = 422) => async (req, res, next) => {
    try {
        const user = await users.findOne({
            username: req.body.username,
        });
        if (isError(user)) {
            res.status(errorCode);
            next(new Error(defaultLoginError));
        } else {
            req.loggingInUser = user;
            next();
        }
    } catch (error) {
        res.status(500);
        next(error);
    }
};

module.exports = {
    checkTokenSetUser,
    isLoggedIn,
    validateUser,
    findUser,
};