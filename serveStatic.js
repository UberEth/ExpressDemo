/**
 * Created by charlesrussell on 1/5/15.
 */
var express = require('express');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');

var app = express()
    .use(serveStatic(__dirname + '/public'))
    .use(serveIndex(__dirname + '/public'))
    .listen(3000);

console.log("Server Started");