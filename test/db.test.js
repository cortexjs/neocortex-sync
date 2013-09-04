var conn = require('../lib/util/db');


describe('db.test', function() {
    it('db query', function() {
        conn.query('SELECT * FROM CM_cortexDependencies', function(err, result) {
            console.log(err, JSON.stringify(result));
            done(err);
        });
    });
});