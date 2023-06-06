const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.signup_get = (req, res, next) => {
  res.render('signup');
};

exports.signup_post = [
  body('name').trim().escape(),
  body('email').trim().escape(),
  body('password')
    .trim()
    .escape()
    .custom((value, { req }) => value === req.body.confirmPassword)
    .withMessage('Passwords do not match'),

  async (req, res, next) => {
    const errors = validationResult(req);
    const cachedForm = {
      name: req.body.name,
      email: req.body.email,
    };
    if (!errors.isEmpty()) {
      return res.render('signup', {
        err: errors.array(),
        form: cachedForm,
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      res.redirect('/login');
    } catch (err) {
      next(err);
    }
  },
];
