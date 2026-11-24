
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'homework7',
    password: 'NobleRival',
    port: 5432
});

module.exports = pool;
