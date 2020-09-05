"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _emailValidator = _interopRequireDefault(require("email-validator"));

var _controllers = require("../controllers");

var _authentication = require("../authentication");

var _models = require("../models");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.default)();
router.route('/signup').post((req, res) => {
  const {
    email,
    password,
    firstName,
    lastName
  } = req.body;

  _models.Users.findOne({
    email
  }).then(user => {
    // Check if a user already has this email address
    if (user) {
      return res.status(409).json({
        message: 'Email address already associated to a user'
      });
    } // Validate email and password


    if (!email || !_emailValidator.default.validate(email)) {
      return res.status(409).json({
        message: 'Please enter a valid email address'
      });
    } else if (!password) {
      return res.status(409).json({
        message: 'Please enter a password'
      });
    } // Make a new user from passed data


    const newUser = new _models.Users({
      email: email.toLowerCase(),
      password,
      first_name: firstName,
      last_name: lastName
    }); // Save the user then transmit to frontend

    return newUser.save().then(savedUser => {
      const json = savedUser.toJSON();
      delete json.password;
      res.status(201).json({
        token: _controllers.userController.tokenForUser(savedUser),
        user: json
      });
    }).catch(error => {
      return res.status(500).json(error);
    });
  }).catch(error => {
    return res.status(500).json(error);
  });
}); // Send user object and server will send back authToken and user object

router.route('/signin').post(_authentication.requireSignin, (req, res) => {
  // This information is loaded or rejected by passport
  const json = req.user.toJSON();
  delete json.password;
  return res.json({
    token: _controllers.userController.tokenForUser(json),
    user: json
  });
});
var _default = router;
exports.default = _default;