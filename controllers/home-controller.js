const Message = require('../models/message');

exports.home_get = async (req, res, next) => {
  try {
    const fetchedMessages = await Message.find().populate('author').exec();
    return res.render('index', {
      messages: fetchedMessages,
    });
  } catch (err) {
    next(err);
  }
};

exports.home_post = async (req, res, next) => {
  const { id } = req.body;
  try {
    await Message.findByIdAndDelete(id);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};
