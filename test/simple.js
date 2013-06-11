var assert = require('assert');
var http = require('http');

var easyreq = require('../');

var host = 'localhost';
var port = 9128;

var CHECKS = 5;

http.createServer(onrequest).listen(port, host, started);

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
    case '/json':
      res.json({key:'value'});
      break;
    case '/html':
      res.html('<html></html>');
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

  http.request('http://localhost:9128/html', function(res) {
    console.log('GET /html');
    console.log('-> statusCode = %d', res.statusCode);
    assert(res.statusCode === 200);
    console.log('-> Content-Length = %d', res.headers['content-length']);
    assert(res.headers['content-length'], '<html></html>'.length);
    if (++i >= CHECKS) process.exit(0);
  }).end();;
  http.request('http://localhost:9128/json', function(res) {
    console.log('GET /json');
    console.log('-> statusCode = %d', res.statusCode);
    assert(res.statusCode === 200);
    console.log('-> Content-Length = %d', res.headers['content-length']);
    assert(res.headers['content-length'], (JSON.stringify({key:'value'}) + '\n').length);
    if (++i >= CHECKS) process.exit(0);
  }).end();;
}
