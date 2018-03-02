'use strict'
const RippleAPI = require('ripple-lib').RippleAPI;
RippleAPI.prototype.getSettings = require('../lib/settings');
RippleAPI.prototype.getTransactions = require('../lib/transactions');
RippleAPI.prototype.signAs = require('../lib/signAs');
RippleAPI.prototype.sortSigners = require('../lib/sortSigners');
const co = require('co');
const api = new RippleAPI({
	server: 'ws://101.201.40.124:5006'
});

co(function*() {
	yield api.connect();
	let orderbook = {
		// "base": {
		// 	"currency": balances[i].currency,
		// 	"counterparty": balances[i].counterparty;
		// },
		"counter": {
			"currency": "ZXC",
			"counterparty": "rnpCj2cTspBrgvuTkpuy3fPv6w8xvgPDW1"
		}
	};
	try {
		// let orderbooks = yield api.getOrderbook('rnpCj2cTspBrgvuTkpuy3fPv6w8xvgPDW1');

		// console.log(orderbooks)
		let payment = {
			source: {
				address: 'rBpNuwdqYw6dcRKreJPhuc1L8hYLnFmn4u',
				maxAmount: {
					value: '99999999999999',
					currency: 'ZXC',
					counterparty: 'rnpCj2cTspBrgvuTkpuy3fPv6w8xvgPDW1'
				}
			},
			destination: {
				address: 'rnpCj2cTspBrgvuTkpuy3fPv6w8xvgPDW1',
				amount: {
					value: '10',
					currency: 'ZXC',
					counterparty: 'rnpCj2cTspBrgvuTkpuy3fPv6w8xvgPDW1'
				},
				tag: 4
			}
		}
		let prepared = yield api.preparePayment(payment.source.address, payment);
		let signedRet = api.sign(prepared.txJSON, 'snoYstkG4by5kupBbUt26W1qMg6pP');
		let ret = yield api.submit(signedRet.signedTransaction);
		console.log(ret)
	} catch (e) {
		console.log(e)
	}
	// try {
	// 	let signedRet = '{"TransactionType":"Payment","Account":"rfZnBdkgrf2MYaz9ZyntRyoz8LySLrKckz","Destination":"rJ4mrqumovVyw9yatiNPQKWjFeuT6Bj7FT","Amount":{"currency":"TSX","issuer":"rELGTvPmx6Zyef1ANE5TwjQScJxrNZMYTX","value":"1000"},"Flags":2147483648,"SendMax":{"currency":"TSX","issuer":"rELGTvPmx6Zyef1ANE5TwjQScJxrNZMYTX","value":"99999999999999"},"LastLedgerSequence":469468,"Fee":"12","Sequence":25,"SigningPubKey":"","Signers":[{"Signer":{"Account":"rfZnBdkgrf2MYaz9ZyntRyoz8LySLrKckz","SigningPubKey":"038F885B9B019547EED763A8150B6578CF702F1264796240276A23EDB346ADD27C","TxnSignature":"3044022000ABAD89A1FFB83866D68258315E384A649CCF6FB4ABD67DAD207E0D1E973C37022072A1840D82C2AB21F7D20471829189D092B1126AFFFF8AF51B7870E20DC40AD9"}}]}';
	// 	console.log(signedRet.length)
	// 	let account = {
	// 		secret: 'saaK4MvryRG2CTTmbbo6NZhA1bzJo',
	// 		address: 'rJ4mrqumovVyw9yatiNPQKWjFeuT6Bj7FT'
	// 	}
	// 	signedRet = api.signAs(signedRet, account);
	// 	console.log(signedRet);
	// 	// signedRet = JSON.stringify(signedRet)
	// 	signedRet = api.sortSigners(signedRet);
	// 	console.log(signedRet)
	// } catch (e) {
	// 	console.log(e)
	// }
	// let Payment = {
	// 	source: {
	// 		address: 'rh5ovU4SE2rx6JCSrfGj3oJJhM9PFoVHQN',
	// 		maxAmount: {
	// 			value: '99999999999999',
	// 			currency: 'WJD',
	// 			counterparty: 'r4uyiuW1xT5gRs5ieYoM3iC2QpgY3kHrsw'
	// 		}
	// 	},
	// 	destination: {
	// 		address: 'rE6wD2UMuoV4giAhogixcScgoxKfmSomPa',
	// 		amount: {
	// 			value: '1000',
	// 			currency: 'WJD',
	// 			counterparty: 'r4uyiuW1xT5gRs5ieYoM3iC2QpgY3kHrsw'
	// 		}
	// 	}
	// }
	// let balances = yield api.getBalances('rE6wD2UMuoV4giAhogixcScgoxKfmSomPa');
	// console.log(balances)

})

function getAssetInfo(address) {
	return new Promise(function(resolve, reject) {
		api.getSettings(address).then(function(info) {
			if (info && info.memos) {
				resolve(JSON.parse(info.memos[0].data));
			}
			resolve(undefined);
		}).catch(function(e) {
			reject(e)
		})
	})
}