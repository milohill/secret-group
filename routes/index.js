let express = require('express');

let router = express.Router();
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const debug = require('debug')('time');

const { body, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/sign-up', (req, res, next) => {
  const err = req.body;
  res.render('sign-up');
});

router.post('/sign-up', [
  body('name').trim().escape(),
  body('email').trim().escape(),
  body('password').trim().escape(),

  async (req, res, next) => {
    // Error occurred in the form body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('sign-up', { err: errors });
    }

    // Passwords don't match
    const { password } = req.body;
    const confirmPassword = req.body['confirm-password'];
    if (password !== confirmPassword) {
      return res.render('sign-up', { err: `confirm password doesn't match` });
    }

    // If errors above don't occur, proceed to saving data
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect('/login');
  },
]);

router.get('/login', (req, res, next) => {
  res.render('login');
});

module.exports = router;
