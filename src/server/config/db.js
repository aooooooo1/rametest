const mysql = require('mysql');
const db= mysql.createPool({
    host: 'localhost',
    user : 'user_codingrecipe',
    password: '1234',
    database: 'db_codingrecipe',
    port: '3306'
})

module.exports = db;