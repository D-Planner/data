"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _passportJwt = require("passport-jwt");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _userModel = _interopRequireDefault(require("../models/user-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable func-names */
_dotenv.default.config({
  silent: true
});

const jwtOptions = {
  jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AUTH_SECRET
};
const jwtLogin = new _passportJwt.Strategy(jwtOptions, (payload, done) => {
  // See if the token matches any user document in the DB
  // Done function in the form -> "done(resulting error, resulting user)"
  _userModel.default.findById(payload.sub, (err, user) => {
    // This logic can be modified to check for user attributes
    if (err) {
      return done(err, false); // Error return
    } else if (user) {
      return done(null, user); // Valid user return
    } else {
      return done(null, false); // Catch no valid user return
    }
  });
});

_passport.default.use(jwtLogin); // Create function to transmit result of authenticate() call to user or next middleware


const requireToken = scopes => {
  return (req, res, next) => {
    _passport.default.authenticate('jwt', {
      session: false
    }, (err, user, info) => {
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
      if (scopes.every(scope => {
        return user.scopes.includes(scope);
      })) return next();else return res.status(401).send('Insufficient scope');
    })(req, res, next);
  };
};

var _default = requireToken;
exports.default = _default;