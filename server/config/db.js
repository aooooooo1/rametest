const mysql = require('mysql');
const db= mysql.createPool({
    // host: 'localhost',
    // user : 'user_codingrecipe',
    // password: '1234',
    // database: 'db_codingrecipe',
    host : 'ro2padgkirvcf55m.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user : 'l5a997w0zukh1vh9',
    password : 't7za34mzqf1o98u3',
    database : 'se1d9i0p64surr02',
    port: '3306'
})

module.exports = db;