'use strict'
const api = global.api;

exports.get = function*() {
	let address = this.session.users.address;
	let secret = this.session.users.secret;
	let data = this.request.body;

	var balances = yield api.getBalances(address, secret);
	let strprice = this.query.codepricestr;
	let dealedprice = this.query.dealedprice;
	let currencyName = this.query.currencyName;
	let buysum = 0;
	let sellsum = 0;

	let codePrice = JSON.parse(strprice);
	console.log(strprice);
	for (let index in codePrice) {
		buysum = codePrice[index].buysum * 1 + buysum * 1;
		sellsum = codePrice[index].sellsum * 1 + sellsum * 1;
	}
	let targetissueraddresss = codePrice[0].issueraddress;
	let code = codePrice[0].code;

	let price = dealedprice; //取最新订单成交价(从交易市场传递过来)
	let buyresultsPrice = [];
	let sellresultsPrice = [];
	for (let key in codePrice) {
		let obj = {};
		if (codePrice[key].direction == "buy") {
			buyresultsPrice.push(codePrice[key]);
		}
		if (codePrice[key].direction == "sell") {
			sellresultsPrice.push(codePrice[key]);
		}
	}

	function sortsellNumber(a, b) {
		return b.price * 1 - a.price * 1;
	}
	sellresultsPrice.sort(sortbuyNumber);

	function sortbuyNumber(a, b) {
		return a.price * 1 - b.price * 1;
	}
	buyresultsPrice.sort(sortsellNumber);

	// for (var index in buyresultsPrice) {
	// 	if (buyresultsPrice[index].price == "0")
	// 		buyresultsPrice[index].price = buyresultsPrice[index].value = "--"
	// }
	// for (var index in sellresultsPrice) {
	// 	if (sellresultsPrice[index].price == "0")
	// 		sellresultsPrice[index].price = sellresultsPrice[index].value = "--"
	// }

	console.log('----------sellresultsPrice------------');
	console.log(sellresultsPrice);
	console.log('----------buyresultsPrice------------');
	console.log(buyresultsPrice);
	const txaddress = '';
	let buyaddress = '';
	let selladdress = '';
	let baseCurrency = '';
	let sum = '';
	let map = {};
	let couterparty = '';

	//得到所有挂单中的制定资产和发行方的挂单价格和数量
	let openorders = [];
	let openorderstmp = [];
	let ret = [];
	let allorders = yield api.queryAllOrders();
	let offers = allorders[0].offers;

	for (let index in offers) {
		let object = [];
		if ((offers[index].taker_gets.currency == code) && (offers[index].taker_gets.issuer == targetissueraddresss)) {
			object["sellsum"] = offers[index].taker_gets.value;
			object["buysum"] = 0;
			openorderstmp.push(object);
		} else if ((offers[index].taker_pays.currency == code) && (offers[index].taker_pays.issuer == targetissueraddresss)) {
			object["buysum"] = offers[index].taker_gets.value;
			object["sellsum"] = 0;
			openorderstmp.push(object);
		}
	}


	for (var i = 0; i < 5; i++) {
		if (!buyresultsPrice[i]) {
			buyresultsPrice.push({
				price: '--',
				value: '--'
			})
		}
		if (!sellresultsPrice[4 - i]) {
			sellresultsPrice[4 - i] = {
				price: '--',
				value: '--'
			}
		}
	}
	var buystr = JSON.stringify(buyresultsPrice);
	var sellstr = JSON.stringify(sellresultsPrice);
	console.log(sellresultsPrice);
	yield this.render('dealassetDetail', {
		balances: balances,
		ret: ret,
		buyresultsPrice: buyresultsPrice,
		sellresultsPrice: sellresultsPrice,
		code: code,
		currencyName: currencyName,
		targetissueraddresss: targetissueraddresss,
		buysum: buysum,
		sellsum: sellsum,
		price: price,
		sellstr: sellstr,
		buystr: buystr
	});
}


/* description				post method in deal details
 * @param void
 * @return
 * @date					2016-07-07
 * @author					csquan
 */
exports.post = function*() {
	yield this.render('dealassetDeal', {
		balances: balances,
		ordersrecords: ordersrecords,
		trustlines: trustlines
	});
};