'use strict';

var get_deps = require('./dependencies.get'),
    //    make_up = require('./makeup.save'),
    connector = require("../../util/connector"),
    async = require('async'),
    util = require('util'),
    debug = require('debug')('neocortex:dependencies-save');

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
    get_deps(options, function(err, data) {
        if (err) return callback(err);

        // module not ok
        if (data.code !== 200) return callback(new Error(data));

        var notFound = data.json.not_found,
            found = data.json.found.array,
            ready = notFound.length === 0;

        for (var i = 0; i < found.length; ++i) {
            if (found[i] == module)
                found.splice(i, 1);
        }


        var dependencies = data.json.found.array.join(','),
            record = {
                Name: name,
                Version: version,
                Dependencies: dependencies
            };

        var styles = data.json.styles.join(",");

        debug("dependencies of %s : %s, styles: %s", module, dependencies, styles);

        connector(function(err,db){
            if(err){
                return callback(err);
            }

            db.query('INSERT INTO CM_CortexPackageDependencies {{values record}} ON DUPLICATE KEY {{update update}}', {
                record: record,
                update: {
                    Dependencies: dependencies,
                    Csses: styles
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
