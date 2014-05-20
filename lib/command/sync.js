var node_path = require("path");
var connector = require("../util/connector");
var read_package_json = require('read-cortex-json');
var semver = require("semver");

function dealVersion(version,prerelease){
    var version_parsed = semver.parse(version);
    if(prerelease){
        version_parsed.prerelease = [prerelease];
    }
    version = version_parsed.format();
    return version;
}

module.exports = function(options, callback) {
    var config = require("../util/config")(options.config);
    connector(config,function(err,db){
        if(err){
            return callback(err)
        }

        var dep = {
            get:require("../action/handler/dependencies.get"),
            save:require("../action/handler/dependencies.save")
        }


        var registry = options.registry || config.registry;

        var module = options.argv.remain[0];
        var pkg;


        function getAndSave(module){
            if(!module.split("@")[1]){
                module = module + "@latest";
            }

            dep.get({
                module:module,
                registry:registry
            },function(err,data){
                if(err){return callback(err);}
                var json = data.json;
                dep.save({
                    module:module,
                    registry:registry,
                    dest:options.dest
                },function(err,result){
                    if(err){return callback(err);}
                    callback(null,result);
                    db.end();
                });
            });
        }

        if(!module){
            read_package_json.get_original_package(process.cwd(),function(err,pkg){
                if(err){return callback(err);}
                if(!pkg.version){return callback(new Error('`version` not specified'));}
                module = [pkg.name,dealVersion(pkg.version,options.prerelease)].join("@");
                getAndSave(module);
            });
        }else{
            getAndSave(module);
        }

    });
};