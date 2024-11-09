const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
  cnnectionString: process.env.DATABASE_URL,
})

module.exports = pool;