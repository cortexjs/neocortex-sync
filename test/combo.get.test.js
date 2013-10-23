var assert = require('chai').assert,
    getCombo = require('../lib/action/handler/combo.get');

describe('combo.get', function() {
    it('test get', function(done) {
        getCombo({}, function(err, data) {
            if(data) assert.equal(data.code, 200);
            done(err);
        });
    });
});
