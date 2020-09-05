/* eslint-disable func-names */
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

import User from '../models/user-model';

dotenv.config({ silent: true });

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AUTH_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the token matches any user document in the DB
  // Done function in the form -> "done(resulting error, resulting user)"
  User.findById(payload.sub, (err, user) => {
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

passport.use(jwtLogin);

// Create function to transmit result of authenticate() call to user or next middleware
const requireToken = (scopes) => {
  return (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      // Return any existing errors
      if (err) { return next(err); }

      // If no user found, return appropriate error message
      if (!user) { return res.status(401).json({ message: info.message || 'Error authenticating email and password' }); }

      req.user = user;

      if (scopes.every((scope) => { return user.scopes.includes(scope); })) return next();
      else return res.status(401).send('Insufficient scope');
    })(req, res, next);
  };
};

export default requireToken;
