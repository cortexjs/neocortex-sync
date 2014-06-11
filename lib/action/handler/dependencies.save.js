'use strict';

var get_deps = require('./dependencies.get'),
    //    make_up = require('./makeup.save'),
    connector = require("../../util/connector"),
    async = require('async'),
    util = require('util'),
    debug = require('debug')('neocortex:dependencies-save'),
    zlib = require("zlib"),
    path = require("path"),
    fs = require("fs"),
    _ = require("underscore");


// save dependencies to mysql
// @param {Object} options
// - module: {string}
function saveDeps(options, callback) {
    var module = options.module;
    var splitted = module.split('@');
    var name = splitted[0];
    var version = splitted[1];
    // @param {Object} data
    // - code: {Number}
    // - json: {Object}
    //      - module: {string}
    //      - dependencies: {Array.<string>} array of dependencies
    //      - styles: {string}

    debug('save dependencies for %s@%s', name, version);

    var tasks = [];

    tasks.push(function(done){

    get_deps(options, function(err, data) {
        if (err) return done(err);

        // module not ok
        if (data.code !== 200) {
            return done(new Error(
                JSON.stringify(data,null,2)
            ));
        }
        var dependencies = data.json.dependencies.join(',');
        var styles = data.json.styles.join(",");
        var asyncDependencies = data.json.asyncDependencies.join(",");

        debug("dependencies of %s : %s, styles: %s, asyncDependencies: %s", module, dependencies, styles, asyncDependencies);
        done(null, {
            dependencies: dependencies,
            asyncDependencies: asyncDependencies,
            styles: styles,
            nojs: data.json.styles && !data.json.main
        });
    });

    });


    async.series(tasks, function(err, results){
        if(err){return callback(err);}
        var deps = results[0];
        var nojs = deps.nojs;

        connector(function(err,db){
            if(err){return callback(err);}
            var depInfos = {
                Dependencies: deps.dependencies,
                AsyncDependencies: deps.asyncDependencies,
                Csses: deps.styles,
                NoJS: nojs ? 1 : 0,
            };
            db.query('INSERT INTO CM_CortexPackageDependencies {{values record}} ON DUPLICATE KEY {{update update}}', {
                record: _.extend({
                    Name: name,
                    Version: version
                },depInfos),
                update: depInfos
            }, function(err) {
                if (err) return callback(err);
                callback(null, {
                    code: 200,
                    json: {
                        msg: 'OK'
                    }
                });
            });
        });

    });
}


module.exports = saveDeps;
