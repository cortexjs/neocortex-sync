'use strict';

var get_deps = require('./dependencies.get'),
    //    make_up = require('./makeup.save'),
    connector = require("../../util/connector"),
    async = require('async'),
    util = require('util'),
    debug = require('debug')('neocortex:dependencies-save'),
    zlib = require("zlib"),
    path = require("path"),
    fs = require("fs");

function get_main_file_gzip_size(name, version, options, done){
    if(!options.dest){
        return done("Missing required arguments: dest");
    }
    version = version.split("-")[0]; // retrieve prerelease
    var filename = name;
    var file_path = path.join(options.dest,name,version,name + ".min.js");
    fs.readFile(file_path, function(err, buf){
        if(err){return done(err);}
        zlib.gzip(buf,function(err,newbuf){
            debug('get gziped size: ' + newbuf.length);
            done(null, newbuf.length);
        });
    })
}


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
    //      - found: {Object}
    //          - tree: {Object} dependency tree
    //          - array: {Array.<string>} array of dependencies
    //      - not_found: {Array.<string>} array of dependencies which not found

    debug('save dependencies for %s@%s', name, version);

    var tasks = [];

    tasks.push(function(done){
        get_main_file_gzip_size(name, version, options, done);
    });
    tasks.push(function(done){

    get_deps(options, function(err, data) {
        if (err) return done(err);

        // module not ok
        if (data.code !== 200) {
            return done(new Error(
                JSON.stringify(data,null,2)
            ));
        };

        var notFound = data.json.not_found,
            found = data.json.found.array,
            ready = notFound.length === 0;

        for (var i = 0; i < found.length; ++i) {
            if (found[i] == module)
                found.splice(i, 1);
        }


        var dependencies = data.json.found.array.join(',');

        var styles = data.json.styles.join(",");

        debug("dependencies of %s : %s, styles: %s", module, dependencies, styles);
        done(null, {
            dependencies: dependencies,
            styles: styles
        })
    });

    });


    async.series(tasks, function(err, results){
        if(err){return callback(err);}
        var size = results[0];
        var deps = results[1];
        var dependencies = deps.dependencies;
        var styles = deps.styles;
        connector(function(err,db){
            if(err){return callback(err);}
            db.query('INSERT INTO CM_CortexPackageDependencies {{values record}} ON DUPLICATE KEY {{update update}}', {
                record: {
                    Name: name,
                    Version: version,
                    Dependencies: dependencies,
                    Csses: styles,
                    Size: size
                },
                update: {
                    Dependencies: dependencies,
                    Csses: styles,
                    Size: size
                }
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
