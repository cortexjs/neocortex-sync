var nod_path = require("path");
var path_extra = require("path-extra");
var home_dir = path_extra.homedir();

module.exports = function(config){
	return require(nod_path.join(home_dir,".neocortex",config||"config"));
};