/**
 * Created by charlesrussell on 1/5/15.
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var https = require('https');
var http  = require('http');
var fs = require('fs');

//Define Middleware

//Increments session state variable for each 'get'
homeHandler = function (req, res) {
    if (req.session.views) {
        req.session.views++;
    }
    else {
        req.session.views = 1;
    }
    res.end('Total views for you: ' + req.session.views + ' \n');
};

//clears cookie if cookie is set
toggleHandler = function(req, res){
    if (req.cookies.name) {
        res.clearCookie('name');
        res.end('name cookie cleared! Was:' + req.cookies.name);
    }
    else {
        res.cookie('name', 'fooBar');
        res.end('name cookie set!');
    }
};

//digitally signs cookie
signedHandler = function(req, res){
    if (req.signedCookies.name) {
        res.clearCookie('name');
        res.end('name cookie cleared! Was:' + req.signedCookies.name);
    }
    else {
        res.cookie('name', 'foobar96', { maxage: 900000, signed: true, httpOnly:true });

        res.end('name cookie set!' + res.cookies);
    }
};

//just goofing around
cookieJunk = function(req,res){
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
};


//Configure Middleware App
try {
    var app = express()
            .use(serveStatic(__dirname + '/public'))                             //static roots
            .use(serveIndex(__dirname +  '/public'))                             //static filesystem
            .use(bodyParser())                                                   //deprecated, should find alternatives
            .use(cookieParser('A019IR56w#$HA12345ABhG', 'STPIsTheRacersEdge'))   //can digitally sign cookies
            .use(cookieSession({keys: ['NowIsTheTimeToNodeAllDay12']}))          //digitally sign the session cookie
            .use('/home', function (req, res) {
                homeHandler(req, res);
            })
            .use('/redirect', function (req,res){                                //hardcoded redirect
                res.redirect('/index.html');
            })
            .use('/reset', function (req, res) {
                delete req.session.views;
                res.end('Cleared all your views');
            })
            .use('/toggle', function (req, res) {
                toggleHandler(req, res);
            })
            .use('/signed', function (req, res) {
                signedHandler(req, res);
            })
            .use(function (req, res) {
                cookieJunk(req, res);
            })
            .use(function (err, req, res, next) {
                res.end('Invalid body!\n');
            })
        ;
    console.log("Middleware Configured");
}
catch(e){
    console.log("Middleware Configuration Error:" + e);
}

/* public & private keys */
var options = {
    key:  fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

/* Spin up Servers */
try{
    server = http.createServer(app).listen(80);
    console.log("HTTP Server Started on Port 3000");
}
catch(e){
    console.log("Unable to Start Server on port 80:" + e);
}

try {
    //server_2 = https.createServer(options, app).listen(443);
    //console.log("HTTPS Server Started on Port 443");
}
catch(e){
    console.log("Unable to Start HTTPS Server: " + e)


}
