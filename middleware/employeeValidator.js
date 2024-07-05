const { body, validationResult } = require('express-validator');

exports.validateEmployee = [
  body('salutation').isString().withMessage('Salutation must be a string.'),
  body('firstName').isString().withMessage('First name must be a string.'),
  body('lastName').isString().withMessage('Last name must be a string.'),
  body('email').isEmail().withMessage('Email must be valid.'),
  body('phone').isString().isLength({ min: 10, max: 15 }).withMessage('Phone number must be valid.'),
  body('dob').isISO8601().toDate().withMessage('Date of birth must be a valid date.'),
  body('gender').isString().withMessage('Gender must be a string.'),
  body('qualifications').isString().optional().withMessage('Qualifications must be a string.'),
  body('address').isString().optional().withMessage('Address must be a string.'),
  body('country').isString().withMessage('Country must be a string.'),
  body('state').isString().withMessage('State must be a string.'),
  body('city').isString().withMessage('City must be a string.'),
  body('pin').isString().isLength({ min: 5, max: 10 }).withMessage('Pin must be a valid postal code.'),
  body('username').isString().withMessage('Username must be a string.'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('New employee validated...............');
    next();
  }
];
