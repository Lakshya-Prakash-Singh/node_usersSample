const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const userController = require('../controllers/user');
const userValidator = require('../validator/user');
var uploadImages = multer({ dest: './' });
var router = express.Router();


router.post('/registration', userValidator.registration, userController.registration);
router.post('/adduser', userValidator.adduser, userController.adduser);
router.post('/login', userValidator.login, userController.login);
router.post('/userlist', userController.userlist);
router.post('/userlist/:UserID', userController.user);

router.put('/userlist/:UserID', userController.userUpdate);

router.delete("/user", userController.deleteUser);

module.exports = router;