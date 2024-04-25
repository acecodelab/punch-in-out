// src/db/db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'punch_in_out',
    password: 'postgres',
    port: 5432,
});

module.exports = pool;
