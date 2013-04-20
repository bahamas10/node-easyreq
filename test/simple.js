var assert = require('assert');
var http = require('http');

var easyreq = require('../');

var host = 'localhost';
var port = 9128;

var CHECKS = 3;

var server = http.createServer(onrequest);
server.listen(port, host, started);

function onrequest(req, res) {
  easyreq(req, res);

  switch (req.urlparsed.pathname) {
    case '/redirect':
      res.redirect('http://google.com');
      break;
    case '/fake':
      res.notfound();
      break;
    case '/error':
      res.error();
      break;
    default:
      res.notfound('no route found');
      break;
  }
}

function started() {
  console.log('server started');
  var i = 0;

  http.request('http://localhost:9128/redirect', function(res) {
    console.log('GET /redirect');
    console.log('-> statusCode = %d', res.statusCode);
    assert(res.statusCode === 302);
    console.log('-> location header = %s', res.headers.location);
    assert(res.headers.location === 'http://google.com');
    if (++i >= CHECKS) process.exit(0);
  }).end();;

  http.request('http://localhost:9128/fake', function(res) {
    console.log('GET /fake');
    console.log('-> statusCode = %d', res.statusCode);
    assert(res.statusCode === 404);
    if (++i >= CHECKS) process.exit(0);
  }).end();;

  http.request('http://localhost:9128/error', function(res) {
    console.log('GET /error');
    console.log('-> statusCode = %d', res.statusCode);
    assert(res.statusCode === 500);
    if (++i >= CHECKS) process.exit(0);
  }).end();;
}
