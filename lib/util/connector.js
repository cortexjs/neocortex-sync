var lion = require("dplion");
var async = require("async");
var node_url = require("url");

var connect = null

module.exports = function(config,callback){
    if(arguments.length == 1){
        callback = arguments[0];
    }

    if(connect){
        return callback(null, connect);
    }


    var client = lion();

        async.parallel([function(done){
            client.get(config.lion.db.url,done);
        },function(done){
            client.get(config.lion.db.username,done);
        },function(done){
            client.get(config.lion.db.password,done);
        }],function(err,results){
            if(err){
                return callback(err);
            }

            var url = results[0];
            var username = results[1];
            var password = results[2];
            var parsed = node_url.parse(url.split("jdbc:")[1]);
            var db = require("../util/db")({
                host: parsed.hostname,
                port: parsed.port,
                user: username,
                password: password,
                database: parsed.pathname.slice(1)
            });

            callback(null,db);
            connect = db;
        });
}