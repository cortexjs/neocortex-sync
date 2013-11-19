var node_path = require("path");
var connector = require("../util/connector");

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

        if(!module){
            pkg = require(node_path.join(process.cwd(),"package.json"));
            module = [pkg.name,pkg.version].join("@");
        }

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
                registry:registry
            },function(err,result){
                callback && callback();
                db.end();
            });

        });
    });
};