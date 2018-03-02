'use strict'
const api = global.api;
const config = global.config
const pa = require('../lib/rippleAPI');

exports.get = function*() {
	let name = '';
	let address = this.request.query.address;
	if (address) {
		try {
			let info = (yield api.getSettings(address)).memos[0];
			name = JSON.parse(info.data).name;
		} catch (e) {
           console.log(e);
		}
	}
	console.log(address,name)
	this.response.body = name;
}