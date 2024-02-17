const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'admin@123',
    port: 5432,
    database: 'movie'
});

module.exports = pool;