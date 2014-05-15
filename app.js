// ------- Dependancies -------

var config = require(__dirname + '/config');
var express = require('express');
var passport = require('passport');
var util = require('util');
// express middleware
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var RedisStore = require('connect-redis')(session);
var session = require('express-session');


var app = express();

app.disable('x-powered-by');

// define a custom log format that includes the connect defaults, and the response time
morgan.format('response-time', ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms');

// attach middleware
app.use(morgan('response-time'));

app.use(bodyParser());
app.use(cookieParser()); // required before session.
app.use(session({
    secret: config.sessionSecret,
    store: new RedisStore()
}));
// use passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

util.log('web server listening on port ' + config.port);
app.listen(config.port);
