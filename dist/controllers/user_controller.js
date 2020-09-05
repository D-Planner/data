"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jwtSimple = _interopRequireDefault(require("jwt-simple"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return _jwtSimple.default.encode({
    sub: user.id,
    iat: timestamp
  }, process.env.AUTH_SECRET);
}

const userController = {
  tokenForUser
};
var _default = userController;
exports.default = _default;