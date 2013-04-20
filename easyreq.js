/**
 * add functions to req and res objects for an http/https server
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: 4/19/2013
 * License: MIT
 */

var path = require('path');
var url = require('url');

module.exports = easyreq;

function easyreq(req, res) {
  // parse the URL and normalize the pathname
  req.urlparsed = url.parse(req.url, true);
  req.urlparsed.pathname = path.normalize(req.urlparsed.pathname);

  // easily send a redirect
  res.redirect = function redirect(url, code, headers) {
    headers = headers || {};
    headers.Location = url;

    res.writeHead(code || 302, headers);
    res.end();
  };

  // shoot a server error
  res.error = function error(code, s) {
    res.statusCode = code || 500;
    res.end(s);
  };

  // 404 to the user
  res.notfound = function notfound() {
    res.statusCode = 404;
    res.end.apply(res, arguments);
  };
}
