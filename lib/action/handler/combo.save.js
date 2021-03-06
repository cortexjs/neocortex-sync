'use strict';

// save combo information

var db = require('../../util/db');
var async = require('async');

// @param {Object} options
// - modules {string}

function save_combo(modules, callback) {
    async.waterfall([
        function(done) {
            db.query('SELECT ComboId FROM CM_CortexCombo ORDER BY ComboId DESC LIMIT 1', function(err, result) {
                done(err, result);
            });
        },
        // TODO:
        // care for concurrence
        function(result, done) {
            var combo_id = result.length ? result[0].ComboId + 1 : 0;

            async.parallel(
                modules.map(function(module) {
                    console.log(module);
                    return function(sub_done) {
                        var splitted = module.split('@');
                        var name = splitted[0];
                        var version = splitted[1];

                        var record = {
                            Name: name,
                            Version: version,
                            ComboId: combo_id
                        };

                        db.query('INSERT INTO CM_CortexCombo {{values record}} ON DUPLICATE KEY {{update update}}', {
                            record: record,
                            update: {
                                ComboId: combo_id
                            }
                        }, function(err) {
                            sub_done(err, 1);
                        });
                    };
                }), function(err, results) {
                    done(err, results.reduce(function(prev, num) {
                        return prev + num;
                    }, 0));
                }
            ); // end async
        }

    ], function(err, updated) {
        callback(err, updated);
    });
}


module.exports = function(options, callback) {
    var modules = options.modules;

    if (!modules || modules.length === 0) {
        return callback(null, {
            code: 201,
            json: {
                msg: 'nothing changed. you should tell us which modules to combo'
            }
        });
    }

    async.series(
        modules.map(function(group) {
            return function(done) {
                save_combo(group, done);
            };
        }), function(err, results) {
            if (err)
                callback(null, {
                    code: 201,
                    json: {
                        msg: err
                    }
                });
            else
                callback(null, {
                    code: 200,
                    json: {
                        msg: results.reduce(function(prev, num) {
                            return prev + num;
                        }, 0) + ' rows affected.'
                    }
                });
        }
    );
};
