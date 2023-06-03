const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('dotenv').config();

const router = express.Router();
// Models
const User = require('../models/user');
const Message = require('../models/message');

/* GET home page. */
router.get('/', async (req, res) => {
  const { user } = req;
  if (!user) {
    return res.render('index');
  }

  const messages = await Message.find().populate('author').exec();
  console.log(messages);

  return res.render('index', { user: user, messages: messages });
});

router.post('/', async (req, res) => {
  const { id } = req.body;
  await Message.findByIdAndDelete(id);
  res.redirect('/');
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post('/sign-up', [
  body('name').trim().escape(),
  body('email').trim().escape(),
  body('password')
    .trim()
    .escape()
    .custom((value, { req }) => value === req.body.confirmPassword)
    .withMessage('Passwords do not match'),
  body('isMember').trim().escape(),

  async (req, res, next) => {
    // Error occurred in the form body
    const errors = validationResult(req);
    const cachedForm = {
      name: req.body.name,
      email: req.body.email,
    };
    if (!errors.isEmpty()) {
      console.log('validation error');
      console.log(errors.array());
      return res.render('sign-up', {
        err: errors.array(),
        form: cachedForm,
      });
    }

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

router.get('/login', (req, res) => {
  res.render('login', { err: req.flash('error') });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

router.get('/register-membership', (req, res) => {
  res.render('register-membership');
});

router.post('/register-membership', async (req, res) => {
  if (req.body.secretCode === process.env.MEMBERSHIP_CODE) {
    const oldUser = await User.findOne({ _id: req.session.passport.user });
    const user = new User({
      _id: oldUser._id,
      name: oldUser.name,
      email: oldUser.email,
      password: oldUser.password,
      isMember: true,
    });
    await User.findByIdAndUpdate(oldUser._id, user, {});
    return res.redirect('/');
  }
  if (req.body.secretCode === process.env.ADMIN_CODE) {
    const oldUser = await User.findOne({ _id: req.session.passport.user });
    const user = new User({
      _id: oldUser._id,
      name: oldUser.name,
      email: oldUser.email,
      password: oldUser.password,
      isAdmin: true,
    });
    await User.findByIdAndUpdate(oldUser._id, user, {});
    return res.redirect('/');
  }
  return res.render('register-membership', { err: 'Wrong code' });
});

router.get('/new-message', (req, res) => {
  res.render('new-message');
});

router.post(
  '/new-message',
  body('title').trim(),
  body('content').trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('new-message', { err: errors.array() });
    }

    const message = new Message({
      author: req.user._id,
      title: req.body.title,
      content: req.body.content,
    });
    await message.save();
    return res.render('new-message', { err: ['A message posted'] });
  }
);

module.exports = router;
