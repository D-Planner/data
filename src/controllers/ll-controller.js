import { Parser } from 'flora-sql-parser';
import { LLAppDB } from '../db';
import * as constants from '../constants';

const parser = new Parser();
const allowedCommands = ['select'];

const serveQuery = (req, res) => {
  const { query } = req.body;
  const limit = 100;
  const page = parseInt(req.query.page, 10) || 0;
  console.log(parser.parse(query, { database: 'PostgresQL' }).type);
  if (allowedCommands.includes(parser.parse(query, { database: 'PostgresQL' }).type)) {
    LLAppDB.query(query).then((data) => {
      res.json({
        totalCount: data.rows.length,
        currentPage: page,
        resultsPerPage: limit,
        nextPageEndpoint: `${constants.SELF_URL}/ll/query?page=${(page + 1)}`,
        hasNextPage: (page + 1) * limit <= data.rows.length,
        data: data.rows.slice(limit * page, Math.min(limit * (page + 1), data.rows.length)),
      });
    });
  } else {
    res.status(500).send('Error');
  }
};

const llController = { serveQuery };

export default llController;
