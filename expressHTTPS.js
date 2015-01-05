/**
 * Created by charlesrussell on 1/5/15.
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var compression = require('compression');
var https = require('https');
var http  = require('http');

var fs = require('fs');

var app = express()
    .use(serveStatic(__dirname + '/public'))
    .use(serveIndex(__dirname + '/public'))
;



/* public & private keys */
var options = {
    key:  fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

/* Spin up Servers */
server = http.createServer(app).listen(80);
server_2 = https.createServer(options, app).listen(443);
