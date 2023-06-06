exports.logout_get = (req, res, next) => {
  if (!res.locals.currentUser) return res.redirect('/');
  req.logout((err) => {
    if (err) return next(err);
  });
  res.redirect('/');
};
