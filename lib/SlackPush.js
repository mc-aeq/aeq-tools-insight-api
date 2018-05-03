'use strict';
var imports = require('soop').imports(),
    https = require("https");

/*
** module dependencies
*/
var config = require('../config/config');
var logger = require('./logger').logger;
var info = logger.info;

var push = function(b) {
        // dont push if hook not defined
        if(config.slack_hook == "") {
                return;
        }        
		
		// assamble the text to be pushed with the details
        if( typeof b != 'string' ) {
			var postData = JSON.stringify({
				"attachments": [
					{
						"fallback": "*Block: " + b.info.height + "* - " + b.hash,
						"text": "<" + config.be_url + "block/" + b.hash + "|Block: " + b.info.height + ">: " + b.hash,
						"fields": [
							{
								"title": "Size",
								"value": b.info.size,
								"short": true
							},
							{
								"title": "Difficulty",
								"value": b.info.difficulty,
								"short": true
							},
							{
								"title": "Reward",
								"value": b.info.reward,
								"short": true
							},
							{
								"title": "Included TX",
								"value": (typeof b.info.tx !== 'undefined' ? b.info.tx.length : 0),
								"short": true
							}
						],
						"color": "good"
					}
				]
			});
        }
        else {
			var postData = JSON.stringify({
					text: b
			});
        }

        // options
        var options = {
                host: 'hooks.slack.com',
                port: 443,
				agent: false,
                path: config.slack_hook,
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData)
                }
        };

        var req = https.request(options, function(res) {
                /*info('DATA: ' + JSON.stringify(postData));
                info('STATUS: ' + res.statusCode);
                info('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                        info('BODY: ' + chunk);
                });*/
				info('Slack Push Status: ' + res.statusCode);
        });

        req.on('error', function(e) {
                info('problem with request: ' + e.message);
        });

        // write data to request body
        req.write(postData);
        req.end();
};

module.exports.push = push;

