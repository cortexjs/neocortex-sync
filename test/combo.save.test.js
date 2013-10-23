var assert = require('chai').assert,
    saveDeps = require('../lib/action/handler/dependencies.save'),
    saveCombo = require('../lib/action/handler/combo.save');

describe('combo.save', function() {

    before(function(done) {
        saveDeps({
            module: "fx@0.1.0"
        }, function(err) {
            saveDeps({
                module: "jquery@1.9.2"
            }, function(err) {
                done(err);
            });
        });
    });

    it('test save empty', function(done) {
        saveCombo({
            module: []
        }, function(err, data) {
            assert.isNull(err);
            assert.equal(data.code, 201);
            done(err);
        });
    });

    it('test save modules', function(done) {

        saveCombo({
            modules: [
                ["fx@0.1.0", 'jquery@1.9.2']
            ]
        }, function(err, data) {
            console.log(data.json.msg);
            assert.equal(data.code, 200);
            done(err);
        });
    });

});
