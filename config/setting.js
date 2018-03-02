'use strict'
require('../lib/date.js');
const RippleAPI = require('ripple-lib').RippleAPI;
RippleAPI.prototype.getSettings = require('../lib/settings');
RippleAPI.prototype.getTransactions = require('../lib/transactions');
RippleAPI.prototype.signAs = require('../lib/signAs');
RippleAPI.prototype.sortSigners = require('../lib/sortSigners');
RippleAPI.prototype.getTrustlines = require('../lib/trustlines');


const config = global.config;
const api = new RippleAPI({
	server: config.rippleServerIp
});
//1.设置全局rippleAPI变量；
global.api = api;
const pa = require('../lib/rippleAPI');
const co = require('co');
co(function*() {
	try {
		yield api.connect();
		yield pa.PaymentSettings({
			address: config.zxcAddress,
			secret: config.zxcSecret
		}, {
			"defaultRipple": true
		})

		console.log('ripple服务器连接成功——————')
	} catch (e) {
		console.log(e)
	}

})