// auth.js
// author : David Freiman
// influenced_by : https://github.com/jlwebster/node_api_auth_client
// license : GPL 3.0
var crypto = require('crypto');
var moment = require('moment');
var settings = require('./settings');
var exports = module.exports;

exports.auth = function(access_id, secret) {
  this.access_id = access_id;
  this.secret = secret;

  this.sign_options = function(options, content_body, algorithm) {
    var content_type = options.headers['Content-Type'];
    if (isEmpty(content_type))
    {
      // Default to json
      content_type = options.headers['Content-Type'] = 'application/json';
    }

    var path = options.path;
    if (isEmpty(path))
    {
      // Default to the host's root
      path = options.path = '/'
    }

    var algorithm = algorithm;
    if (isEmpty(algorithm)) {
      algorithm = options.algorithm = 'sha1';
    }

    var algorithm_label = settings.algorithm_labels[algorithm];
//    var content_md5 = crypto.createHash('md5').update(JSON.stringify(content_body)).digest('base64');

    var date = moment().utc().format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT';

    var canonical_string = [options.method, content_type, '', path, date].join();

    var auth_header_value = 'APIAuth' + algorithm_label + ' ' + this.access_id + ':' + crypto.createHmac(algorithm, this.secret).update(canonical_string).digest('base64');

    //options.headers['Content-MD5'] = content_md5;
    options.headers['DATE'] = date;
    options.headers['Authorization'] = auth_header_value;

    return options;
  };

  return this;
};

function isEmpty(value)
{
  return value === null || value === '' || typeof value === 'undefined';
}

