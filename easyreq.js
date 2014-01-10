/**
 * add functions to req and res objects for an http/https server
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: 4/19/2013
 * License: MIT
 */

var http = require('http');
var path = require('path');
var url = require('url');

var cleanse = require('cleanse');

module.exports = easyreq;

function easyreq(req, res) {
  // parse the URL, normalize the pathname and cleanse the querystring
  req.urlparsed = url.parse(req.url, true);
  req.urlparsed.normalizedpathname = path.normalize(req.urlparsed.pathname);
  cleanse(req.urlparsed.query);

  // easily send a redirect
  res.redirect = function redirect(uri, code) {
    res.setHeader('Location', uri);
    res.statusCode = code || 302;
    res.end();
  };

  // shoot a server error or end with a code
  res.error = function error(code, s) {
    if (typeof code !== 'number') {
      s = code;
      code = 500;
    }
    res.statusCode = code;
    res.end(s || http.STATUS_CODES[code]);
  };

  // 404 to the user
  res.notfound = function notfound(s) {
    res.statusCode = 404;
    if (s)
      res.end.apply(res, arguments);
    else
      res.end(http.STATUS_CODES[res.statusCode]);
  };

  // send json
  res.json = function json(obj, code) {
    var content = JSON.stringify(obj);
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
