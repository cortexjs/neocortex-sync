'use strict';

var node_path = require('path');
var commander = require('comfort');

// cli entrance
// cache commander instance


module.exports = commander({
    command_root: node_path.join( __dirname, 'command'),
    option_root : node_path.join( __dirname, 'option'),
    name: 'neocortex'
}).on('complete',function(info){
    if(info.err){
        console.log(info.err);
        process.exit(1);
    }
});

