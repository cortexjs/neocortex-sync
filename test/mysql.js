var assert = require('chai').assert,
    conn = require('../lib/util/db');

describe('db.js', function() {
    it('test query', function(done) {
        conn.query(
            "SELECT * FROM CM_cortexDependencies",
            function(err, result) {
                console.log(err, result);
                done(err);
            }
        );
    });
});

// function a(a, b, c) {
//     a = 1;
//     b = 2;
//     c = 3;

//     arguments[1] = 1;

//     console.log(arguments);  
// };

// a(0, 0, 0)