const express = require('express');

const router = express.Router();

// controllers
const homeController = require('../controllers/home-controller');
const signupController = require('../controllers/signup-controller');
const loginController = require('../controllers/login-controller');
const messageController = require('../controllers/message-controller');
const redeemController = require('../controllers/redeem-controller');
const logoutController = require('../controllers/logout-controller');

router.get('/', homeController.home_get);

router.post('/', homeController.home_post);

router.get('/signup', signupController.signup_get);

router.post('/signup', signupController.signup_post);

router.get('/login', loginController.login_get);

router.post('/login', loginController.login_post);

router.get('/message', messageController.message_get);

router.post('/message', messageController.message_post);

router.get('/redeem', redeemController.redeem_get);

router.post('/redeem', redeemController.redeem_post);

router.get('/logout', logoutController.logout_get);

module.exports = router;
