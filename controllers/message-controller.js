const { body, validationResult } = require('express-validator');
const Message = require('../models/message');

exports.message_get = (req, res) => {
  if (!res.locals.currentUser) return res.redirect('/login');
  res.render('message');
};

exports.message_post = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Create a title with 15 fewer characters'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage('Create content with 40 fewer characters'),
  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.render('message', { err: errors.array() });
    }
    try {
      const message = new Message({
        author: res.locals.currentUser._id,
        title: req.body.title,
        content: req.body.content,
      });
      await message.save();
      return res.render('message', { err: [{ msg: 'A message posted' }] });
    } catch (err) {
      next(err);
    }
  },
];
