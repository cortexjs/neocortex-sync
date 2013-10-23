var assert = require('chai').assert,
    db = require('../lib/util/db'),
    saveDeps = require('../lib/action/handler/dependencies.save');


describe('dependencies.save', function() {
    it('save dependencies', function(done) {
        saveDeps({
            module: "align@0.1.0"
        }, function(err, result) {
            console.log(JSON.stringify(result));
            done(err);
        });
    });
});
