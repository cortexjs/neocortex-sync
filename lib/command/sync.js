var config = require("../util/config");
var db = require("../util/db");
var dep = {
    get:require("../action/handler/dependencies.get"),
    save:require("../action/handler/dependencies.save")
}

module.exports = function(options, callback) {

    var registry = options.registry || config.registry;

    var module = options.argv.remain[0];

    if(!module.split("@")[1]){
        module = module + "@latest";
    }

    dep.get({
        module:module,
        registry:registry   
    },function(err,data){
        if(err){return callback(err);}
        var json = data.json;
        console.log(module);
        dep.save({
            module:module,
            registry:registry
        },function(err,result){
            console.log(JSON.stringify(result));
            callback && callback();
            db.end();
        });

    });
};