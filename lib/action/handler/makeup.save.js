'use strict';

var get_deps = require('./dependencies.get');
var db = require('../../util/db');
var async = require('async');
// var semver = require('semver');
var lang = require('../../util/lang'),
    debug = require('debug')('neocortex:makeup-save');

// make up the data loss

// @param {Object} options
// - module: {string} 'a@0.0.1'
// - dependencies: {Array}
// - pending: {Array}
module.exports = function(options, callback) {
    var series = [];

    if (!options.module) {
        return callback(null, {
            code: 403,
            json: {
                error: 'one and only one module should be specified.'
            }
        });
    }

    debug("%s %s", options.module, JSON.stringify(options.dependencies));

    var splitted = options.module.split('@');
    var name = splitted[0];
    var version = splitted[1];

    // if from direct http request, 
    // `options.dependencies` and `options.pending` could be trusted
    if (options.http) {
        series.push(function(done) {
            get_deps({
                module: options.module
            }, function(err, data) {
                if (err) {
                    return done(err);
                }
                // module not ok
                if (data.code !== 200) {
                    return done(true, data);
                }

                options.dependencies = data.json.found.array;
                options.pending = data.json.not_found;

                done();
            });
        });
    }

    series.push(function(done) {
        db.query(
            "SELECT CM_CortexPendingDependencies.NameAffected, CM_CortexPendingDependencies.VersionAffected, CM_CortexPackageDependencies.Dependencies FROM CM_CortexPendingDependencies INNER JOIN CM_CortexPackageDependencies {{on on}} {{where where}}", {
                on: {
                    'CM_CortexPendingDependencies.NameAffected': 'CM_CortexPackageDependencies.Name',
                    'CM_CortexPendingDependencies.VersionAffected': 'CM_CortexPackageDependencies.Version'
                },

                where: {
                    'CM_CortexPendingDependencies.Name': name,
                    'CM_CortexPendingDependencies.Version': version
                }
            },
            function(err, result) {

                // result
                // -> [
                //      {
                //          NameAffected: 'a',
                //          VersionAffected: '0.0.1',
                //          Dependencies: 'c@0.0.1' 
                //      },
                //      {}
                //    ]
                done(err, result);
            }
        );
    });

    series.push(function(result, done) {
        async.parallel(
            result.map(function(record) {
                return function(sub_done) {
                    // the record which matches each result will be only one
                    db.query(
                        'UPDATE CM_CortexPackageDependencies {{set set}} {{where where}}', {
                            where: {
                                Name: record.NameAffected,
                                Version: record.VersionAffected
                            },

                            set: {
                                Dependencies: lang.pushUnique(record.Dependencies.split(','), options.dependencies)
                            }
                        }, function(err) {
                            sub_done(err);
                        }
                    );
                };
            }),

            function(err) {
                done(err, result.length);
            }
        );
    });

    async.waterfall(series, function(err, data) {
        if (err) {
            data ? callback(null, data) : callback(err);

        } else {
            callback(null, {
                code: 200,
                json: {
                    msg: data + ' rows affected'
                }
            });
        }


    });
};
