
// Opt in to strict mode of JavaScript, [ref](http://is.gd/3Bg9QR)
// Use this statement, you can stay away from several frequent mistakes 
'use strict';

// How to use a foreign module ?
// 'cortex-hello' for example:
//
// 1. install dependency, exec the command below at the root of the current repo:
// 		ctx install cortex-hello --save
// 2. use `require(module_idendifier)` method:
// 		var hello = require('cortex-hello');

// `exports` is the API of the current module
exports.my_method = function() {
    // your code...
};

// or you could code like this:
// 		module.exports = {
// 			my_method: function() {
// 	    		hello();
// 			}
// 		};