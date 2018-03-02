'use strict'
const api = global.api;
const config = global.config;
const util = require('./util');
const co = require('co');
var keypairs = require('ripple-keypairs');



function* Payment(payment, secret) {
	let prepared = yield api.preparePayment(payment.source.address, payment);
	let signedRet = api.sign(prepared.txJSON, secret);
	let ret = yield api.submit(signedRet.signedTransaction);
	return failRender(ret);
}

function* PaymentTrustline(account, trustline) {
	let prepared = yield api.prepareTrustline(account.address, trustline);
	let signedRet = api.sign(prepared.txJSON, account.secret);
	let ret = yield api.submit(signedRet.signedTransaction);
	return failRender(ret);
}

function* PaymentSettings(account, settings) {
	let prepared = yield api.prepareSettings(account.address, settings);
	let signedRet = api.sign(prepared.txJSON, account.secret);
	let ret = yield api.submit(signedRet.signedTransaction);
	return failRender(ret);
}

function* PaymentCancel(account, orderCancellation) {
	let prepared = yield api.prepareOrderCancellation(account.address, orderCancellation);
	let signedRet = yield api.sign(prepared.txJSON, account.secret);
	let ret = yield api.submit(signedRet.signedTransaction);
	return failRender(ret);
}

function* getPriceAndName(address) {
	let trans = yield api.getTransactions(address, {
		types: ['order']
	});
	let price = 0;
	let name = '';
	if (trans.length > 0) {
		for (let j = 0; j < trans.length; j++) {
			let orderbookChanges = trans[j].outcome.orderbookChanges[Object.keys(trans[j].outcome.orderbookChanges)[0]];
			if (trans[j].specification.totalPrice.currency === 'ZXC' && orderbookChanges && orderbookChanges[0].status !== 'created') {
				let spec = trans[j].specification;
				price = (orderbookChanges[0].totalPrice.value * 1000) / (orderbookChanges[0].quantity.value * 1000);
				break;
			}
		}
	}

	let info = (yield api.getSettings(address)).memos;
	if (info && info[0].type == 'USERINFO') {
		info = JSON.parse(info[0].data);
		if (info.price && info.name) {
			if (price == 0) {
				price = info.price * 1;
			}
			name = info.name;
		}
	}

	return [price, name];
}

function* getUserInfo(address) {
	let settings = yield api.getSettings(address);

	let userInfo = null;
	try {
		userInfo = JSON.parse(settings.memos[0].data)
	} catch (e) {}
	return userInfo;
}

function* PaymentOrder(account, order) {
	let prepared = yield api.prepareOrder(account.address, order);
	let signedRet = yield api.sign(prepared.txJSON, account.secret);
	let ret = yield api.submit(signedRet.signedTransaction);
	return failRender(ret);
}

function failRender(ret) {
	console.log(ret.resultCode);
	return new Promise(function(resolve, reject) {
		if (ret.resultCode !== 'tesSUCCESS') {
			reject(new Error(ret.resultCode));
		} else {
			resolve(ret.resultCode);
		}
	})
}

function getAssetInfo(address, account) {
	return new Promise(function(resolve, reject) {
		api.getSettings(address).then(function(info) {
			if (info && info.memos) {
				info = JSON.parse(info.memos[0].data);
				info.address = address;
				if (account && info.secret) {
					try {
						let data = util.decode(info.secret, account.secret);
						data = JSON.parse(data);
						if (data.address === account.address) {

							info.secret = data.secret;
						}
					} catch (e) {
						delete info.secret;
					}
				}
				resolve(info)
			}
			resolve(null);
		})
	})
}

function ensureSuccess(fn, args, time) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			co(function*() {
				try {
					yield fn.apply(null, args);
					resolve('success');
				} catch (e) {
					console.log(e);
					ensureSuccess(fn, args, time)
				}
			})
		}, time)
	})
}

function sleep(time) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			resolve(null);
		}, time);
	})
}

function generateAddress(secret) {
	var keypair = keypairs.deriveKeypair(secret);
	var address = keypairs.deriveAddress(keypair.publicKey);
	return {
		secret: secret,
		address: address
	};
}

module.exports = {
	ensureSuccess: ensureSuccess,
	Payment: Payment,
	PaymentTrustline: PaymentTrustline,
	PaymentCancel: PaymentCancel,
	PaymentSettings: PaymentSettings,
	getUserInfo: getUserInfo,
	getPriceAndName: getPriceAndName,
	PaymentOrder: PaymentOrder,
	getAssetInfo: getAssetInfo,
	sleep: sleep,
	generateAddress: generateAddress
}