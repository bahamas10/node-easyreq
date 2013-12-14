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
  res.redirect = function redirect(uri, code) {
    res.setHeader('Location', uri);
    res.statusCode = code || 302;
    res.end();
  };

  // shoot a server error or end with a code
  res.error = function error(code, s) {
    res.statusCode = code || 500;
    res.end(s);
  };

  // 404 to the user
  res.notfound = function notfound() {
    res.statusCode = 404;
    res.end.apply(res, arguments);
  };

  // send json
  res.json = function json(obj, code) {
    var content = 'null';
    try {
      content = JSON.stringify(obj);
    } catch (e) {}
    if (!res.getHeader('Content-Type'))
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (!res.getHeader('Content-Length'))
      res.setHeader('Content-Length', Buffer.byteLength(content, 'utf-8'));
    if (code)
      res.statusCode = code;

    res.end(content);
  };

  // send html
  res.html = function html(html_, code) {
    if (!res.getHeader('Content-Type'))
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (!res.getHeader('Content-Length'))
      res.setHeader('Content-Length', Buffer.byteLength(html_, 'utf-8'));
    if (code)
      res.statusCode = code;

    res.end(html_);
  };
}
