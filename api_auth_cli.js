var ApiAuthCli = (function(){
    'use strict';

    var settings = require('./settings'),
        body = require('./request_body'),
        auth = require('./auth'),
        request = require('request'),

        run = function(argv) {
            var path = argv.path,
                method = argv.method,
                algorithm = argv.algorithm,
                access_id = argv.access_id,
                secret = settings.api_credentials.secret,
                port = settings.api_credentials.port,
                host = settings.api_credentials.endpoint,
                uri = host + ':' + port + path,
                options = {
                    host: host,
                    path: path,
                    uri: uri,
                    method: method,
                    port: port,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

            if (method == 'PUT' || method == 'PATCH' || method == 'POST') {
                options.body = body;
                options.json = true;
            }
            options = auth.auth(access_id, secret).sign_options(options, body, algorithm);
            var req = request(options, function(error, response, body) {
                console.log('error:', error); // Print the error if one occurred 
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
                console.log('body:', body); // Print the HTML for the Google homepage. 
            });

            return req;
        };

    return { run: run };
})();

var argv = require('yargs').argv;
ApiAuthCli.run(argv);
