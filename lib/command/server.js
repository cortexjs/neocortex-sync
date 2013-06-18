'use strict';

var node_http = require('http');
var node_url = require('url');
var node_path = require('path');

var typo = require('typo');
var fs = require('fs-sync');

var ACTION_ROOT = node_path.join( __dirname, '..', 'action' );

module.exports = function(options, callback) {
	
	// TODO: migrate to `connect` middlewave
	node_http.createServer(function(req, res) {
	    var url = node_url.parse(req.url, true);

	    var action = url.pathname.replace(/^\//, '');
	    var action_file = node_path.join( ACTION_ROOT, action + '.js' );

	    if( fs.exists( action_file ) ){
	    	var handler = require(action_file);

	    	handler(url.query, function(err, data) {
	    		if(err){
	    			res.writeHead(500, "Server Side Error");
	    			data = {
	    				msg: err
	    			};

	    		}else{
	    			res.writeHead(200, "OK");
	    		}

	    		res.write( JSON.stringify(data) );

	    		res.end();
	    	});


	    }else{
	    	res.writeHead(500, "Server Side Error");
	    	res.write( 
	    		typo.template('Error: action "{{action}}" not found.', {
		    		action: action || 'empty'
		    	}) 
		    );
	    	res.end();
	    }


	}).listen(options.port, function() {
	    var url = 'http://localhost:' + options.port;

        typo.log('Neocortex server started at {{url}}', {
        	url: url
        });

	    options.open && require('child_process').exec('open ' + url);
        callback && callback();
	});

};