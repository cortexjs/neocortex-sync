'use strict';

var db = require('../../util/db');

module.exports = function(options, callback) {
    db.query('SELECT * FROM CM_CortexCombo', function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, {
            code: 200,
            // category modules according to ComboId
            json: result
                .reduce(function(prev, current) {
                    var id = current.ComboId;

                    if (!prev[id]) {
                        prev[id] = [];
                    }

                    prev[id].push({
                        name: current.Name,
                        version: current.Version
                    });

                    return prev;
                }, [])
                .filter(function(subject, i, arr) {
                    // filter empty lines
                    return i in arr;
                })
        });
    });
};
