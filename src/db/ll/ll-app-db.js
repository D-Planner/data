import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ silent: true });

const LLAppDB = new Client({
  user: process.env.LL_APP_DB_USER,
  password: process.env.LL_APP_DB_PASSWORD,
  database: process.env.LL_APP_DB_NAME,
  host: process.env.LL_APP_DB_HOST,
  port: parseInt(process.env.LL_APP_DB_PORT, 10),
  ssl: {
    rejectUnauthorized: false,
  },
});

export default LLAppDB;
