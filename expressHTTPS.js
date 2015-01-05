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
    .use(serveStatic(__dirname + '/public'))    //static roots
    .use(serveIndex(__dirname + '/public'))     //static filesystem
    .use(bodyParser())
    .use(cookieParser('A019IR56w#$HA12345ABhG','STPIsTheRacersEdge')) //can digitally sign cookies
    .use(function (req, res) {

        if(req.cookies.parsed){
            console.log('Already Parsed:', req.cookies.parsed);
        }
        else {
            console.log('First Pass');
        }

        if (req.body.foo) {
            res.cookie('parsed','yes', {maxAge:900000, httpOnly:true});
            res.end('Body parsed! Value of foo: ' + req.body.foo + '\n');
        }
        else {
            console.log('---client request cookies header:\n', req.headers['cookie']);
            res.cookie('parsed','no');
            res.end('Body does not have foo!\n');
        }
    })
    .use(function (err, req, res, next) {
        res.end('Invalid body!\n');
    })
;



/* public & private keys */
var options = {
    key:  fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

/* Spin up Servers */
server = http.createServer(app).listen(80);
server_2 = https.createServer(options, app).listen(443);
