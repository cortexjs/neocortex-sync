var assert = require('chai').assert,
    saveDeps = require('../lib/action/handler/dependencies.save');


describe('dependencies.save', function() {
    it('save dependencies', function(done) {
        saveDeps({
            module: "fx@0.1.0"
        }, function(err, deps) {
            console.log(JSON.stringify(deps));
            done(err);
        });
    });
});