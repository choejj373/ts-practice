"use strict"


import mysql from 'mysql2/promise';

//const getConnection = require("../config/db");

console.log( process.env.DB_HOST );
console.log( process.env.DB_USER );
const dbPool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PSWORD,
    database:process.env.DB_DATABASE,
    connectionLimit:10,
    multipleStatements: true,
    keepAliveInitialDelay: 10000, // 0 by default.
    enableKeepAlive: true, // false by default  
    // dateStrings: 'date'  
});

dbPool.on('release', () =>{
    // console.log("db pool conn is released");
})

export  { dbPool, mysql };

// const mysql = require("mysql2");

// const dbPool = mysql.createPool({
//     host:process.env.DB_HOST,
//     user:process.env.DB_USER,
//     password:process.env.DB_PSWORD,
//     database:process.env.DB_DATABASE,
//     connectionLimit:10,
//     multipleStatements: true,
// });
// //try catch 필요한가?
// function getConnection(callback){
//     dbPool.getConnection( function(err, conn ){
//         if(!err){
//             callback(conn);
//         }
//     });
// }
 
//module.exports = getConnection;
//module.exports = dbPool;