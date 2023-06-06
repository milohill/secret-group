const passport = require('passport');

exports.login_get = (req, res) => {
  if (res.locals.currentUser) return res.redirect('/');
  res.render('login', { err: req.flash('error') });
};

exports.login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
});
