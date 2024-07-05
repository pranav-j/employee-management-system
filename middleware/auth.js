const User = require('../models/userDB');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticator = async (req, res, next) => {
    // console.log('COOKIES',req.cookies);
    const token = req.cookies.jwt;

    if(!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'You are not logged in! Please log in to get access.'
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decodedToken.id);
        if(!currentUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user belonging to this token does no longer exist.'
            });
        }
        req.user = currentUser;
        console.log('Authenticated...............');
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid token. Please log in again!'
        });
    }
};