let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

// Middlewares

// Cookie handlers
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Models
const User = require('./models/user');

// Application
const mongoDB = process.env.MONGO_DB_URL;

const main = async () => {
  await mongoose.connect(mongoDB);
};

main().catch((err) => {
  console.log(err);
});

let indexRouter = require('./routes/index');

let app = express();

mongoose.set('strictQuery', false);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Passport configuration
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async function (email, password, done) {
      const user = await User.findOne({ email: email });
      bcrypt.compare(password, user.password, function (err, res) {
        if (res) {
          return done(null, user);
        }
        return done(null, false, {
          message: 'Incorrect password',
        });
      });
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findOne({ _id: id });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Express configuration
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// app.use(flashMessageHandler);

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
