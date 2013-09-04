'use strict';

var request = require('request'),
    async = require('async'),
    lang = require('../../util/lang'),
    debug = require('debug')('neocortex:dependencies-get');

// get module deps

function recursively_get_dependencies(name, version, cache, registry, callback) {
    async.waterfall([
        function(done) {
            // get dependencies information
            // http://registry.npmjs.org/async/0.0.1
            debug("retrive info from %s/%s/%s", registry, name, version);
            request([registry, name, version].join('/'), function(err, res, json) {
                if (err) {
                    return done(err);
                }

                if (res.statusCode === 404) {
                    // if package not found, push to `cache.not_found`
                    lang.pushUnique(cache.not_found, name + '@' + version);
                    done(null, {});

                } else {
                    if (Object(json) !== json) {
                        try {
                            json = JSON.parse(json);
                        } catch (e) {
                            return done(new Error('invalid response body, ' + e));
                        }
                    }

                    if (json.cortex && json.cortex.exactDependencies)
                        done(null, lang.object_member_by_namespaces(json, 'cortex.exactDependencies', {}));
                    else
                        done(null, json.dependencies || {});
                }
            });
        }
    ], function(err, deps) {
        if (err) return callback(err);

        var series = [];
        Object.keys(deps).forEach(function(dep_name) {
            var dep_version = deps[dep_name];
            var dep = dep_name + '@' + dep_version;

            // prevent duplicate asynchronous request
            if (!cache.found[dep]) {
                cache.found[dep] = true;

                series.push(function(done) {
                    recursively_get_dependencies(dep_name, dep_version, cache, registry, done);
                });
            }

        });

        cache.found[name + '@' + version] = deps;

        async.parallel(series, callback);
    });
}


// sort tree obj with topological order

function toposort(obj, reverse) {
    var rs = [],
        visited = {};

    function addDeps(module) {
        if (!visited.hasOwnProperty(module)) {
            visited[module] = true;

            if (reverse)
                rs.push(module);
            else
                rs.unshift(module);

            if (obj.hasOwnProperty(module)) {
                var mobj = obj[module],
                    deps = Object.keys(mobj).map(function(name) {
                        return name + '@' + mobj[name];
                    });

                deps.forEach(function(depmodule) {
                    addDeps(depmodule);
                });
            }
        }
    }

    Object.keys(obj).forEach(function(module) {
        addDeps(module);
    });

    return rs;
}

// {
//     "a@0.0.1": {
//         "b": "0.0.1"
//     },
//     "b@0.0.1": {}
// }
// -> ['a@0.0.1', 'b@0.0.1']

function deps2array(obj) {
    var array = [];

    Object.keys(obj).forEach(function(dep) {
        var dep_dep_obj = obj[dep];

        lang.pushUnique(array, dep);
        lang.pushUnique(
            array,
            Object.keys(dep_dep_obj).map(function(dep_name) {
                return dep_name + '@' + dep_dep_obj[dep_name];
            })
        );
    });

    return array;
}

// @public
// @param {Object} options
// - module {string}
// - registry {string}
// @param {function(err, result)} callback

// See ./README.md
module.exports = function(options, callback) {
    var module = options.module;

    // debug
    // options.registry = options.registry || profile.option('registry');
    // TODO
    options.registry = (options.registry && options.registry.replace(/\/$/, '')) || "http://registry.npm.dp";


    var splitted = module.split('@');
    var name = splitted[0];
    var version = splitted[1];

    debug("get dependencies for %s@%s from %s", name, version, options.registry);

    var cache = {
        // {
        //     "a@0.0.1": {
        //         "b": "0.0.1"
        //     },
        //     "b@0.0.1": {}
        // }
        found: {},

        // @type {Array.<string>}
        not_found: []
    };

    recursively_get_dependencies(name, version, cache, options.registry, function(err) {
        if (err) return callback(err);

        // `cache.found[dep] = true;`
        // TODO: whether need to delete the not_found

        if (module in cache.found) {
            delete cache.found[module];

            callback(null, {
                code: 200,
                json: {
                    module: module,
                    found: {
                        tree: cache.found,
                        array: toposort(cache.found, true)
                    },
                    not_found: cache.not_found
                }
            });

            // if the entrance package is not found, there will be a complete failure
        } else {
            callback(null, {
                code: 404,
                json: {
                    error: 'version not found in ' + name + ' : ' + version
                }
            });
        }
    });
};