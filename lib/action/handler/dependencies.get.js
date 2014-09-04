'use strict';

var request = require('request'),
    async = require('async'),
    semver = require('semver'),
    lang = require('../../util/lang'),
    debug = require('debug')('neocortex:dependencies-get'),
    _ = require("underscore");


// get module deps

function getDeps(name, version, registry, callback) {
    // retriveing queue

    debug('get dependencies for %s@%s', name, version);

    function getDepArray(json, field){
        var data = null;
        var array = [];
        if (json.cortex && json.cortex[field]){
            data = lang.object_member_by_namespaces(json, 'cortex.' + field, {});
        }else{
            data = json[field] || {};
        }

        for (var mn in data) {
            var mv = data[mn];
            array.push([mn,mv].join("@"));
        }

        return array;
    }

    function getDepsFor(cb) {
        debug("retrive info from %s/%s/%s", registry, name, version);
        request([registry, name, version].join('/'), function(err, res, json) {
            debug("from registry: err = %s, code = %s, json = %s", err, res.statusCode, json);
            if (err) return cb(err);
            if (res.statusCode != 200) {
                callback(new Error('module ' + name + '@' + version +  ' not found'));
            } else {
                if (Object(json) !== json) {
                    try {
                        json = JSON.parse(json);
                    } catch (e) {
                        return cb(new Error('invalid response body, ' + e));
                    }
                }

                cb(null,{
                    dependencies: getDepArray(json,"dependencies"),
                    asyncDependencies: getDepArray(json,"asyncDependencies"),
                    styles: json.styles || json.css || [],
                    main: json.main
                })
            }
        });
    }

    getDepsFor(callback);
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
    options.registry = (options.registry && options.registry.replace(/\/$/, ''));

    var splitted = module.split('@');
    var name = splitted[0];
    var version = splitted[1];

    debug("get dependencies for %s@%s from %s", name, version, options.registry);

    getDeps(name, version, options.registry, function(err, info) {
        if (err) return callback(err);

        callback(null, {
            code: 200,
            json: _.extend({
                module: module,
            },info)
        });
    });
};
