const User = require('../models/userDB');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.signupOrLoginPage = async(req, res) => {
    return res.render('signupOrLogin');
}

exports.signUpPage = async(req, res) => {
    return res.render('signup');
}

exports.logInPage = async(req, res) => {
    return res.render('login');
}

const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// -------------------------------------------------------------------------------------------------------------------------

// BELOW IS THE IMPLEMENTATION OF SIGNUP USING A JWT TOCKEN

// exports.signUp = async(req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const newUser = await User.create({ name, email, password });

//         const verificationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
//         const verificationUrl = `http://${req.headers.host}/verify-email?token=${verificationToken}`;
        
//         const mailOptions = {
//             from: process.env.EMAIL_USERNAME,
//             to: email,
//             subject: 'ems EMAIL VERIFICATION',
//             text: `Please click on the following link to verify your email: ${verificationUrl}`
//         }

//         transporter.sendMail(mailOptions, function(error, info) {
//             if (error) {
//                 console.log('Error sending email: ', error);
//             } else {
//                 console.log('Email sent: ' + info.response);
//             }
//         });

//         console.log('User added succesfully, but yet to be verified...............');
//         res.status(201).redirect('/login');
//     } catch (error) {
//         console.log('Error adding User...............',error);
//         res.status(500).json({
//             status: 'error',
//             mesage: 'Error signing up user',
//             error: error.mesage
//         });
//     }
// };

// exports.verifyEmail = async(req, res) => {
//     try {
//         const { token } = req.query;
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decodedToken.userId);
//         if(!user) return res.status(400).send('Invalid token.');

//         user.verified = true;
//         await user.save();
//         console.log('User email verified...............');
//         res.send("Email verified successfully!");
//     } catch (error) {
//         // res.status(500).send("Internal Server Error");
//         res.status(500).json({ error: error });
//     }
// };

// -------------------------------------------------------------------------------------------------------------------------

// const crypto = require('crypto');

exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const otp = crypto.randomInt(100000, 999999).toString();

        const newUser = await User.create({ name, email, password, otp });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'ems EMAIL VERIFICATION',
            text: `Your OTP for email verification is: ${otp}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error sending email: ', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        console.log('User added successfully, but yet to be verified...............');
        res.status(201).redirect('/verify-otp?email=' + email);
    } catch (error) {
        console.log('Error adding User...............', error);
        res.status(500).json({
            status: 'error',
            message: 'Error signing up user',
            error: error.message
        });
    }
};


exports.varifyOTPpage = (req, res) => {
    const email = req.query.email;
    res.render('verify-otp', { email });
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp) {
            return res.status(400).send('Invalid OTP.');
        }

        user.verified = true;
        user.otp = undefined; // Clear the OTP field after verification
        await user.save();
        console.log('User email verified...............');
        // res.send("Email verified successfully!");
        res.status(201).redirect('/login');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -----------------------------------------------------------------------------------------------------------------------------

exports.logIn = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        // console.log(user);

        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: 'failed',
                mesage: 'Incorrect email or password'
            });
        }

        if(!user.verified) {
            console.log('User yet to be verified...............');
            return res.status(401).json({
                status: 'failed',
                message: 'You must verify your email before logging in.'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.cookie('jwt', token, cookieOptions);

        return res.redirect('/');
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error logging in user',
            error: error.message
        });
    }
};