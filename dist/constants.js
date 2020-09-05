"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SELF_URL = exports.MONGODB_URI = exports.PORT = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _package = _interopRequireDefault(require("../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config({
  silent: true
});

const PORT = process.env.PORT || 9090;
exports.PORT = PORT;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/dplanner-data';
exports.MONGODB_URI = MONGODB_URI;
const SELF_URL = process.env.NODE_ENV === 'development' ? `http://localhost:${9090}` : _package.default.productionURL;
exports.SELF_URL = SELF_URL;