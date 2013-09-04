'use strict';

var request = require('request'),
    async = require('async'),
    semver = require('semver'),
    lang = require('../../util/lang'),
    debug = require('debug')('neocortex:dependencies-get');



// sort tree obj with topological order

function toposort(root, obj, reverse) {
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
                var mobj = obj[module];
                if (mobj) {
                    var deps = Object.keys(mobj).map(function(name) {
                        return name + '@' + mobj[name];
                    });

                    deps.forEach(function(depmodule) {
                        addDeps(depmodule);
                    });
                }
            }
        }
    }

    addDeps(root);

    return rs;
}

// get module deps

function retrieveDeps(name, version, registry, callback) {
    // retriveing queue
    var queue = [name + '@' + version],
        deps = {};

    debug('get dependencies for %s@%s', name, version);

    function getDepsFor(cb) {
        if (queue.length > 0) {
            var module = queue.shift(),
                splited = module.split('@');

            debug("retrive info from %s/%s/%s", registry, splited[0], splited[1]);
            request([registry, splited[0], splited[1]].join('/'), function(err, res, json) {
                if (err) return cb(err);
                if (res.statusCode === 404) {
                    deps[splited[0] + '@' + splited[1]] = false;
                } else {
                    if (Object(json) !== json) {
                        try {
                            json = JSON.parse(json);
                        } catch (e) {
                            return cb(new Error('invalid response body, ' + e));
                        }
                    }

                    var dependencies;
                    if (json.cortex && json.cortex.exactDependencies)
                        dependencies = lang.object_member_by_namespaces(json, 'cortex.exactDependencies', {});
                    else
                        dependencies = json.dependencies || {};

                    deps[module] = dependencies;

                    for (var mn in dependencies) {
                        var mv = dependencies[mn];
                        if (semver.valid(mv)) {
                            var mm = mn + '@' + mv;
                            if (!deps.hasOwnProperty(mm))
                                queue.push(mm);
                        } else {
                            deps[mn + '@' + mv] = {};
                        }
                    }
                }
                getDepsFor(cb);
            });
        } else {
            cb(null, deps);
        }
    }

    getDepsFor(function(err, deps) {
        callback(err, deps);
    });
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


    retrieveDeps(name, version, options.registry, function(err, deps) {
        if (err) return callback(err);
        if (!deps.hasOwnProperty(module) || !deps[module]) {
            // missing
            callback(null, {
                code: 404,
                json: {
                    error: 'version not find in ' + name + ' : ' + version
                }
            });
        } else {
            var ready = true,
                not_found = [],
                found = [];

            for (var m in deps) {
                if (!deps[m]) {
                    ready && (ready = false);
                    not_found.push(m);
                }
            }

            callback(null, {
                code: 200,
                json: {
                    module: module,
                    found: {
                        tree: deps,
                        array: toposort(module, deps, true)
                    },
                    not_found: not_found
                }
            });

        }
    });
};