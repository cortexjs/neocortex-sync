'use strict';

// var mysql = require('mysql');
var mysql = require('mysql-wrapper');

// start connection
// var pool = mysql.createPool({
//     host: '127.0.0.1',
//     port: '3306',
//     user: 'root',
//     password: '123456',
//     database: 'test',
//     debug: process.env.NODE_ENV == 'debug'
// });


module.exports = {
    query: function(sql, callback) {
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, rows) {
                callback(err, rows);
                connection.release();
            });
        });
    }
};


module.exports = mysql({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'test'
});