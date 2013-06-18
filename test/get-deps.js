'use strict';

var get_deps = require('../lib/get-deps');


get_deps('a@0.0.1', {
	registry: 'http://registry.npm.lc'

}, function(err, deps) {
    console.log(deps)
});
