const { check, validationResult } = require('express-validator'); 
const globals = require("../globals.json");

module.exports = {
    registration: 
    [
        check('Email', 'Email length should be 3 to 50 characters') 
                        .isEmail().isLength({ min: 3, max: 50 }), 
        check('FirstName', 'First Name length should be 3 to 20 characters') 
                        .isLength({ min: 3, max: 20 }),
        check('LastName', 'Last Name Max length should be 20 characters') 
                        .isLength({ max: 20 }), 
        check('PhoneNumber', 'Mobile number should contains 10 digits') 
                        .isLength({ min: 10, max: 10 }), 
        check('Password', 'Password length should be min. 8 to characters') 
                        .isLength({ min: 8 }) 
    ],
    adduser: 
    [
        check('Email', 'Email length should be 3 to 50 characters') 
                        .isEmail().isLength({ min: 3, max: 50 }), 
        check('FirstName', 'First Name length should be 3 to 20 characters') 
                        .isLength({ min: 3, max: 20 }),
        check('LastName', 'Last Name Max length should be 20 characters') 
                        .isLength({ max: 20 }), 
        check('PhoneNumber', 'Mobile number should contains 10 digits') 
                        .isLength({ min: 10, max: 10 })
    ],
    login: [
        check('Password', 'Password length should be min. 8 to characters') 
                        .isLength({ min: 8 }) 
    ]
}