const { body } = require('express-validator');

const signupValidationRules = [
    body('name').isString().isLength({ min: 1 }).withMessage('Name is required.'),
    body('email').isEmail().withMessage('Email must be valid.'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
];

const loginValidationRules = [
    body('email').isEmail().withMessage('Email must be valid.'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
];

module.exports = {
    signupValidationRules,
    loginValidationRules,
};
