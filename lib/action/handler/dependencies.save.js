'use strict';

var get_deps = require('./dependencies.get'),
    make_up = require('./makeup.save'),
    async = require('async'),
    db = require('../../util/db'),
    util = require('util'),
    debug = require('debug')('neocortex:dependencies-save');


// save dependencies to mysql
// @param {Object} options
// - module: {string}
module.exports = function(options, callback) {

    // @param {Object} data
    // - code: {Number}
    // - json: {Object}
    //      - module: {string}
    //      - found: {Object}
    //          - tree: {Object} dependency tree
    //          - array: {Array.<string>} array of dependencies
    //      - not_found: {Array.<string>} array of dependencies which not found
    get_deps(options, function(err, data) {
        if (err) return callback(err);

        // module not ok
        if (data.code !== 200) {
            return callback(err, data);
        }

        var module = options.module;
        var splitted = module.split('@');
        var name = splitted[0];
        var version = splitted[1];
        var ready = true;
        for (var any in data.json.not_found) {
            // not ready for publish
            ready = false;
            break;
        }


        var dependencies = data.json.found.array.join(',');
        debug("dependencies of %s : %s", module, dependencies);
        var record = {
            Name: name,
            Version: version,
            Dependencies: dependencies
        };


        if (ready) {
            // save dependencies

            return callback(null, record);

            db.query('INSERT INTO CM_cortexDependencies {{values record}} ON DUPLICATE KEY {{update update}}', {
                record: record,
                update: {
                    Dependencies: dependencies
                }

            }, function(err) {
                callback(err);
            });
        }else {
            // insert into CM_cortextCachedDependencies
        }
        return;
        async.parallel([
            function(done) {

                // save dependencies
                db.query('INSERT INTO CM_cortexDependencies {{values record}} ON DUPLICATE KEY {{update update}}', {
                    record: record,
                    update: {
                        Dependencies: dependencies
                    }

                }, function(err) {
                    done(err);
                });
            },
            // save pending package into CM_cortexPendingDependencies
            function(done) {
                async.parallel(
                    data.json.not_found.map(function(pending) {
                        return function(sub_done) {
                            var splitted = pending.split('@');

                            db.query('INSERT INTO CM_cortexPendingDependencies {{set set}}', {
                                Name: splitted[0],
                                Version: splitted[1],
                                NameAffected: name,
                                VersionAffected: version

                            }, function(err) {
                                sub_done(err);
                            });
                        };
                    }),

                    function(err) {
                        done(err);
                    }
                );
            }

        ], function(err) {
            // db.end();
            if (err) {
                callback(err);

            } else {
                callback(null, {
                    code: 200,
                    json: {
                        msg: 'OK'
                    }
                });

                // background task
                make_up({
                    module: options.module,
                    dependencies: dependencies,
                    pending: data.json.not_found

                }, function() {
                    // there's no message 
                });
            }
        });
    });
};