const Pool = require('pg').Pool;
const dotenv = require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const connection = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORT_DB,
    database: process.env.DB_NAME,
    ssl: true,
});

module.exports = connection;