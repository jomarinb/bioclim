const request = require('request');

module.exports.httpGet = function(url) {
  return new Promise(function(resolve, reject) {
    request(url, function (err, res) {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(res.body));
    });
  });
};
