'use strict';

var mysql = require('mysql-wrapper');

var db = null;

module.exports = function(dbconfig){
	if(!db){
		db = mysql(dbconfig);
		db.createConnection();	
	}
	return db;
}