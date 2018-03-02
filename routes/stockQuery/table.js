'use strict'

const api = global.api;
const config = global.config
const pa = require('../../lib/rippleAPI');
const util = require('../../lib/util');
const _ = require('lodash');
const maxamount = '99999999999999';

exports.get = function*() {
	let balances = yield api.getBalances(this.query.address, {
		currency: this.query.name
	});
	let assetInfo = yield pa.getAssetInfo(this.query.address, this.session.user)
	var result = [];
	for (let i = 0; i < balances.length; i++) {
		console.log(balances[i])
		let acccoutnInfo = yield pa.getUserInfo(balances[i].counterparty);
		if (acccoutnInfo) {
			balances[i].name = acccoutnInfo.name;

			balances[i].value = parseInt(-1 * balances[i].value)
			result.push(balances[i]);
		}
	}
	yield this.render('/stockQuery/table', {
		result: result,
		currency: this.query.name,
		name: assetInfo.name
	});
};