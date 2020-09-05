"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _floraSqlParser = require("flora-sql-parser");

var _db = require("../db");

var constants = _interopRequireWildcard(require("../constants"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const parser = new _floraSqlParser.Parser();
const allowedCommands = ['select'];

const serveQuery = (req, res) => {
  const {
    query
  } = req.body;
  const limit = 100;
  const page = parseInt(req.query.page, 10) || 0;
  console.log(parser.parse(query, {
    database: 'PostgresQL'
  }).type);

  if (allowedCommands.includes(parser.parse(query, {
    database: 'PostgresQL'
  }).type)) {
    _db.LLAppDB.query(query).then(data => {
      res.json({
        totalCount: data.rows.length,
        currentPage: page,
        resultsPerPage: limit,
        nextPageEndpoint: `${constants.SELF_URL}/ll/query?page=${page + 1}`,
        hasNextPage: (page + 1) * limit <= data.rows.length,
        data: data.rows.slice(limit * page, Math.min(limit * (page + 1), data.rows.length))
      });
    });
  } else {
    res.status(500).send('Error');
  }
};

const llController = {
  serveQuery
};
var _default = llController;
exports.default = _default;