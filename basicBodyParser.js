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

var options = {
    key:  fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

var app = express()
    .use(bodyParser())
    .use(cookieParser('A019IR56w#$HA12345ABhG','STPIsTheRacersEdge')) //can digitally sign cookies
    .use(cookieSession({
        keys: ['NowIsTheTimeToNodeAllDay12']
    })) //digitally sign the session cookie
    .use('/home', function (req, res) {
        if (req.session.views) {
            req.session.views++;
        }
        else{
            req.session.views = 1;
        }
        res.end('Total views for you: ' + req.session.views + ' \n');
    })
    .use('/reset',function(req,res){
        delete req.session.views;
        res.end('Cleared all your views');
    })
    .use('/toggle', function (req, res) {

        if (req.cookies.name) {
            res.clearCookie('name');
            res.end('name cookie cleared! Was:' + req.cookies.name);
        }
        else {
            res.cookie('name', 'fooBar');
            res.end('name cookie set!');
        }
    })
    .use('/signed', function (req, res) {
        if (req.signedCookies.name) {
            res.clearCookie('name');
            res.end('name cookie cleared! Was:' + req.signedCookies.name);
        }
        else {
            res.cookie('name', 'foobar96', { maxage: 900000, signed: true, httpOnly:true });

            res.end('name cookie set!' + res.cookies);
        }
    })
    .use(serveStatic(__dirname + '/public'))
    .use(serveIndex(__dirname + '/public'))
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

 //HTTPS - SSL
 //https.createServer(options, app).listen(443);

 //HTTP
 http.createServer(app).listen(80);

