const mysql = require('mysql2')


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jerule@499',
    database: 'shopDB'
})


module.exports = connection