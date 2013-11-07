'use strict';

exports.options = {
	config: {
        type: String,
        info: 'config file',

        // > 9000 will be more safe
        // NEO -> 230
        value: "config.json"
    }
};

exports.info = 'Sync infos from package.json to mysql database.';