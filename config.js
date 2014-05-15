var env = process.env.NODE_ENV || 'development';
var extend = require('node.extend');

var defaults = {
    sessionSecret: 'white pelicans'
};

var config = {
    development: extend({
        port: 8888
    }, defaults),
    production: extend({
        port: 80
    }, defaults)
};

module.exports = config[env];
