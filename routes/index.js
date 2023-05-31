const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const bcrypt = require('bcryptjs');
// Models
const User = require('../models/user');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post('/sign-up', [
  body('name').trim().escape(),
  body('email').trim().escape(),
  body('password').trim().escape(),
  body('isMember').trim().escape(),

  async (req, res, next) => {
    // Error occurred in the form body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('validation error');
      return res.render('sign-up', { err: errors.array() });
    }

    // Passwords don't match
    const { password } = req.body;
    const { confirmPassword } = req.body;
    if (password !== confirmPassword) {
      console.log('passwords unmatching error');
      const cachedForm = {
        name: req.body.name,
        email: req.body.email,
      };
      return res.render('sign-up', {
        err: `Passwords don't match`,
        form: cachedForm,
      });
    }

    // If errors above don't occur, proceed to saving data
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isMember: req.body.isMember,
    });
    await newUser.save();
    res.redirect('/login');
  },
]);

router.get('/login', (req, res, next) => {
  res.render('login');
});

module.exports = router;
