/**
 * Created by charlesrussell on 1/5/15.
 */
var express = require('express');


express()
    .use(function (req, res, next) {
        res.end('hello express!');
    })
    .listen(3000);
