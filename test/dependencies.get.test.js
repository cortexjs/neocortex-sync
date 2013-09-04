var assert = require('chai').assert,
    getDep = require('../lib/action/handler/dependencies.get');

describe('dependencies.get', function() {
    it('get dependencies', function(done) {
        getDep({
            module: "fx@0.1.0"
        }, function(err, deps) {
            assert(deps.code === 200);
            console.log(JSON.stringify(deps));
            done(err);
        });
    });

    it('get dependencies missing', function(done) {
        getDep({
            module: "fx@0.4.0"
        }, function(err, deps) {
            assert.equal(deps.code, 404);
            done(err);
        });
    });

    it('get really dependencies', function(done) {
        this.timeout(20000);
        getDep({
            registry: "http://registry.npmjs.org/",
            module: "jade@0.35.0"
        }, function(err, deps) {
            console.log(JSON.stringify(deps.json.not_found));
            done(err);
        });
    });
});