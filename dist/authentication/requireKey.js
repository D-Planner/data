"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config({
  silent: true
});

const {
  MASTER_API_KEY
} = process.env; // Create function to transmit result of authenticate() call to user or next middleware

const requireKey = scopes => {
  return (req, res, next) => {
    if (req.query.dapikey === MASTER_API_KEY) next();else res.status(401).send('Invalid API key');
  };
};

var _default = requireKey;
exports.default = _default;