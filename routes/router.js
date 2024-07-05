const express = require('express');
const multer = require('multer');
const path = require('path');
const EmployeeDB = require('../models/employeeDB');
const authMiddleware = require('../middleware/auth');
const { validateEmployee } = require('../middleware/employeeValidator');
const { signupValidationRules, loginValidationRules } = require('../middleware/userValidator');
const router = express.Router();

const controller = require('../controllers/controller');
const userControlls = require('../controllers/userController');

router.get('/', authMiddleware.authenticator, controller.index);

router.post('/addEmployee', authMiddleware.authenticator, validateEmployee, controller.addEmp);
router.delete('/employees/:id', authMiddleware.authenticator, controller.deleteEmp);
router.get('/edit-employees-view/:id', authMiddleware.authenticator, controller.editEmpView);
router.put('/edit-employees-save/:id', authMiddleware.authenticator, validateEmployee, controller.editEmpSave);
router.get('/employees-details/:id', authMiddleware.authenticator, controller.empDetails);

router.get('/search', authMiddleware.authenticator, controller.search);

router.get('/signupOrLogin', userControlls.signupOrLoginPage);
router.get('/signup', userControlls.signUpPage);
router.get('/login', userControlls.logInPage);

router.post('/signup', signupValidationRules, userControlls.signUp);
// router.get('/verify-email', userControlls.verifyEmail);
router.post('/login', loginValidationRules, userControlls.logIn);

router.get('/verify-otp', userControlls.varifyOTPpage);
router.post('/verify-otp', userControlls.verifyOTP);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const destination = path.resolve(__dirname, '..', 'public', 'images');
        console.log('uploaded to ............... : ', destination);
        cb(null, destination);
        // cb(null, '../public/images');
    },
    filename: function(req, file, cb) {
        cb(null, req.params.id + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/employees/:id/avatar', upload.single('avatar'), async (req, res) => {
    
    console.log("Received file:", req.file);
    console.log("Request params:", req.params);
    
    if (req.file) {

        const avatarPath = `/images/${req.file.filename}`;
        await EmployeeDB.Employee.findByIdAndUpdate(req.params.id, { avatar : avatarPath});

        console.log('Image uploaded successfully...............');
        res.status(200).json({ message: 'Image uploaded successfully...............' });
    } else {
        console.log('No file uploaded');
        res.status(400).json({ message: 'Failed to upload image...............' });
    }
});

module.exports = router;