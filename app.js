var http = require('http');
var app = require('koa')();
require('./config/config');
var logger = require('koa-logger');

require('./config/setting');
var views = require('koa-views');
var bodyparser = require('koa-bodyparser');
var session = require('koa-session');


var router = require('./routes/index');
var cors = require('koa-cors');
app.keys = ['zx-asset'];

// app['Max-Age'] = 10;
app.use(bodyparser());
app.use(session({
	maxAge: 1000 * 60 * 60 * 3
}));
app.use(require('koa-static')(__dirname + '/public'));
app.use(views('views', {
	root: __dirname + '/views',
	default: 'ejs'
}));
app.use(logger());
app.use(cors())
app.use(router.routes());

http.createServer(app.callback()).listen(3000);
console.log('this server listening 3000')