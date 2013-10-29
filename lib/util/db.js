'use strict';

// var mysql = require('mysql');
var mysql = require('mysql-wrapper');
var nod_path = require("path");
var path_extra = require("path-extra");
var fs_sync = require("fs-sync");

var home_dir = path_extra.homedir();

var db_config_path = nod_path.join(home_dir,".neocortex","dbconfig.json");
module.exports = mysql(fs_sync.readJSON(db_config_path));
