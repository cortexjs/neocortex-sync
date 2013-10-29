'use strict';

// var mysql = require('mysql');
var config = require("./config");
var mysql = require('mysql-wrapper');

module.exports = mysql(config.db);
