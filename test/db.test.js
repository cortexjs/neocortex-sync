var assert = require('chai').assert,
    conn = require('../lib/util/db');


describe('db.test', function() {
    it('db query', function(done) {
        conn.createConnection();
        assert(conn.connection.escape instanceof Function);
        conn.query('SELECT * FROM CM_cortexDependencies', function(err, result) {
            done(err);
        });
    });

    it('db insert', function(done) {
        conn.query('INSERT INTO CM_cortexDependencies {{values record}} ON DUPLICATE KEY {{update update}}', {
            record: {
                Name: 'am',
                Version: '0.2.3',
                Dependencies: 'xxxx@0.1.2'
            },
            update: {
                Dependencies: "xxxx@0.1.2"
            }
        }, function(err) {
            done(err);
        });
    });

    it('db query.where', function(done) {
        conn.query('SELECT Name, Version, NameAffected, VersionAffected FROM CM_cortexPendingDependencies {{where where}}', {
            where: {
                Name: 'fx',
                Version: '0.1.0'
            }
        }, function(err, results) {
            console.log(results);
            done(err);
        });
    });
});