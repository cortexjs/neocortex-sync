'use strict';

var get_deps = require('./dependencies.get'),
    //    make_up = require('./makeup.save'),
    db = require('../../util/db'),
    async = require('async'),
    util = require('util'),
    debug = require('debug')('neocortex:dependencies-save');

// create connection in advance
db.createConnection();

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
        if (data.code !== 200) return callback(err, data);

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

        debug("dependencies of %s : %s", module, dependencies);

        if (ready) {
            // save dependencies
            async.waterfall([
                    function(done) {
                        // insert dependencies
                        db.query('INSERT INTO CM_CortexDependencies {{values record}} ON DUPLICATE KEY {{update update}}', {
                            record: record,
                            update: {
                                Dependencies: dependencies
                            }
                        }, function(err) {
                            done(err);
                        });
                    },
                    function(done) {
                        // update affected modules if have one
                        db.query('SELECT Name, Version, NameAffected, VersionAffected FROM CM_CortexPendingDependencies {{where where}}', {
                            where: {
                                Name: name,
                                Version: version
                            }
                        }, function(err, results) {
                            done(err, results);
                        });
                    },
                    function(rows, done) {
                        var modules = rows.map(function(row) {
                            return row.NameAffected + '@' + row.VersionAffected;
                        });
                        var seriasFn = [];
                        modules.forEach(function(m) {
                            seriasFn.push(function(dFn) {
                                var opts = {};
                                for (var o in options) {
                                    opts[o] = options[o];
                                }
                                opts.module = m;
                                saveDeps(opts, dFn);
                            });
                        });

                        async.parallel(seriasFn, function(err) {
                            done(err);
                        });
                    },
                    function(done) {
                        db.query('DELETE FROM CM_CortexPendingDependencies {{where where}}', {
                            where: {
                                Name: name,
                                Version: version
                            }
                        }, function(err) {
                            done(err);
                        });
                    }
                ],
                function(err) {
                    if (err) return callback(err);

                    callback(null, {
                        code: 200,
                        json: {
                            msg: 'OK'
                        }
                    });
                });
        } else {
            // insert into CM_CortextCachedDependencies
            var missingModules = notFound.map(function(missingM) {
                var splitted = missingM.split('@');
                return {
                    Name: db.connection.escape(splitted[0]),
                    Version: db.connection.escape(splitted[1]),
                    NameAffected: db.connection.escape(name),
                    VersionAffected: db.connection.escape(version)
                };
            });


            var sqlStr = 'INSERT INTO CM_CortexPendingDependencies (Name, Version, NameAffected, VersionAffected) VALUES ',
                valuesStr = missingModules.map(function(m) {
                    return '(' + [m.Name, m.Version, m.NameAffected, m.VersionAffected].join(', ') + ')';
                }).join(', ');

            sqlStr += valuesStr + ' ON DUPLICATE KEY UPDATE Name=Name';

            // update pending table
            db.query(sqlStr, function(err) {
                if (err) return callback(err);
                callback(null, {
                    code: 200,
                    json: {
                        msg: 'OK'
                    }
                });
            });

            // save information for makeup?
        }
    });
}


module.exports = saveDeps;
