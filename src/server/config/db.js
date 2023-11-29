const mysql = require('mysql');
const db= mysql.createPool({
    // host: 'localhost',
    // user : 'user_codingrecipe',
    // password: '1234',
    // database: 'db_codingrecipe',
    host : 'ro2padgkirvcf55m.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user : 'hbh6ot75h89gjt21',
    password : 'xvw2tvi8dv7294fx',
    database : 'd9phcv15p2949b6j',
    port: '3306'
})

module.exports = db;