const pool = require("../config/db")


function connectDB() {
    pool
        .connect()
        .then(() => console.log('\x1b[32m' + '[DATABASE] Connected' + '\x1b[0m'))
        .catch((err) =>
            console.error('\x1b[31m' + 'connection error', err.stack, err.name + '\x1b[0m')
        )
}

module.exports = connectDB