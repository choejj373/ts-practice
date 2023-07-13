"use strict"


import mysql from 'mysql2/promise';

let dbPool:mysql.Pool;

export function CreateDBPool(){
    dbPool = mysql.createPool({
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
  
}

export function GetConnection() : Promise<mysql.PoolConnection> {
   return dbPool.getConnection();
}

export function ReleaseConnection( conn : mysql.PoolConnection ) : void {
    dbPool.releaseConnection( conn );
}
// export function Format( sql : string, values : any) : string;
export function Format( sql : string, values : any[] | any) : string
{
    return mysql.format( sql, values );
}