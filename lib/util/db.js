'use strict';

// var mysql = require('mysql');
var mysql = require('mysql-wrapper');

module.exports = mysql({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'test'
});