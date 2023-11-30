const mysql = require('mysql');
const db= mysql.createPool({
    // host: 'localhost',
    // user : 'user_codingrecipe',
    // password: '1234',
    // database: 'db_codingrecipe',
    host : 'j21q532mu148i8ms.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user : 'eqmnewvsjo8szo21',
    password : 'iu3er83b71e5ilyo',
    database : 'jtpmgsbag6g69tg6',
    port: '3306'
})

module.exports = db;