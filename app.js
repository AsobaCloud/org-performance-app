// ------- Dependancies -------

var config = require(__dirname + '/config');
var express = require('express');
var passport = require('passport');
var util = require('util');
// express middleware
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var stylus = require('stylus');


var app = express();

app.disable('x-powered-by');

// attach middleware
app.use(morgan());
app.use(bodyParser());
app.use(cookieParser()); // required before session.
app.use(session({
    secret: config.sessionSecret,
    store: new RedisStore()
}));
// use passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(stylus.middleware({ src: __dirname + '/public' }));
app.use(express.static(__dirname + '/public'));

util.log('web server listening on port ' + config.port);
app.listen(config.port);
