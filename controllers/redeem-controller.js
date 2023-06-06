const User = require('../models/user');

exports.redeem_get = (req, res) => {
  if (!res.locals.currentUser) return res.redirect('/login');
  res.render('redeem');
};

exports.redeem_post = async (req, res, next) => {
  if (req.body.secretCode === process.env.MEMBERSHIP_CODE) {
    try {
      const user = new User(res.locals.currentUser);
      user.isMember = true;
      user.isAdmin = false;
      await User.findByIdAndUpdate(user.id, user, {});
      return res.redirect('/');
    } catch (err) {
      next(err);
    }
  }
  if (req.body.secretCode === process.env.ADMIN_CODE) {
    try {
      const user = new User(res.locals.currentUser);
      user.isMember = false;
      user.isAdmin = true;
      await User.findByIdAndUpdate(user.id, user, {});
      return res.redirect('/');
    } catch (err) {
      next(err);
    }
  }
  res.render('redeem', { err: 'Wrong code' });
};
