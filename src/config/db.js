const Pool = require('pg').Pool


const pool = new Pool({
    host: process.env.dbHOST,
    database: process.env.dbDATABASE,
    user: process.env.dbUSER,
    password: process.env.dbPASSWORD,
    // ssl: true
})
module.exports = pool
