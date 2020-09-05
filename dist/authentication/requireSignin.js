"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _passportLocal = _interopRequireDefault(require("passport-local"));

var _userModel = _interopRequireDefault(require("../models/user-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable func-names */
// Configure what LocalStrategy will check for as a username
const localOptions = {
  usernameField: 'email'
}; // Make a login strategy to check email and password against DB

const localLogin = new _passportLocal.default(localOptions, (email, password, done) => {
  // Validation of parameters
  if (!email || !password) {
    return done(null, false, {
      message: 'You must provide an email address and password'
    });
  }

  return _userModel.default.findOne({
    email
  }, (error, user) => {
    // Was a user with the given email able to be found?
    if (error) return done(error);
    if (!user) return done(null, false, {
      message: 'Email address not associated with a user'
    }); // Compare password associated with email and passed password

    return user.comparePassword(password, (err, isMatch) => {
      if (err) {
        done(err);
      } else if (!isMatch) {
        done(null, false, {
          message: 'Incorrect password'
        });
      } else {
        done(null, user);
      }
    });
  });
});

_passport.default.use(localLogin); // Create function to transmit result of authenticate() call to user or next middleware


const requireSignin = function (req, res, next) {
  // eslint-disable-next-line prefer-arrow-callback
  _passport.default.authenticate('local', {
    session: false
  }, function (err, user, info) {
    // Return any existing errors
    if (err) {
      return next(err);
    } // If no user found, return appropriate error message


    if (!user) {
      return res.status(401).json({
        message: info.message || 'Error authenticating email and password'
      });
    }

    req.user = user;
    return next();
  })(req, res, next);
};

var _default = requireSignin;
exports.default = _default;