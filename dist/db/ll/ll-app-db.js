"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pg = require("pg");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config({
  silent: true
});

const LLAppDB = new _pg.Client({
  user: process.env.LL_APP_DB_USER,
  password: process.env.LL_APP_DB_PASSWORD,
  database: process.env.LL_APP_DB_NAME,
  host: process.env.LL_APP_DB_HOST,
  port: parseInt(process.env.LL_APP_DB_PORT, 10),
  ssl: {
    rejectUnauthorized: false
  }
});
var _default = LLAppDB;
exports.default = _default;