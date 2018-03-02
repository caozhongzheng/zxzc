
'use strict';
const api = global.api;
const config = global.config
const pa = require('../../lib/rippleAPI');
const util = require('../../lib/util');
const _ = require('lodash');
const maxamount = '99999999999999';

exports.get = function*() {

	/*
	 功能：得到交易记录
	 传入参数：帐户地址address
	 返回：交易记录数组*/
	var transactions = yield api.getTransactions(this.session.user.address, {
		types: ['order']
	});
	var balances = yield api.getBalances(this.session.user.address);
	var banObj = {}
	for (let i = 0; i < balances.length; i++) {
		banObj[balances[i].currency] = {
			name: balances[i].currencyname,
			counterparty: balances[i].counterparty
		};
	}
	var data = [];


	for (let i = 0; i < transactions.length; i++) {

		let spec = transactions[i].specification;
		if (!banObj[spec.quantity.currency]){
			continue;
		} 
		let orderbookChanges = transactions[i].outcome.orderbookChanges[Object.keys(transactions[i].outcome.orderbookChanges)[0]];
		let balanceChanges = transactions[i].outcome.balanceChanges[banObj[spec.quantity.currency].counterparty];
		// console.log(balanceChanges)
		if (spec.totalPrice.currency != "XRP" && balanceChanges && balanceChanges[0].currency == spec.quantity.currency && balanceChanges[1].currency == spec.quantity.currency && orderbookChanges[0] && orderbookChanges[0].status !== 'created') {
			let dd = {};
			dd.direction = this.session.user.address === transactions[i].address?'buy':'sell';
			dd.currency = spec.quantity.currency;
			dd.timestamp = new Date(transactions[i].outcome.timestamp).toLocaleString();
			dd.price = (orderbookChanges[0].totalPrice.value * 1000) / (orderbookChanges[0].quantity.value * 1000);
			dd.sum = orderbookChanges[0].quantity.value;
			dd.currencyname = banObj[spec.quantity.currency].name;
			data.push(dd);
		}
	}

   

	yield this.render('/market/list', {
		ordersrecords: data
	});
};