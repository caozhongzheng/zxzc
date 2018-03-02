'use strict'
const streamBuffers = require('stream-buffers');
const parse = require('co-busboy');
const util = require('../lib/util');
const api = global.api;
exports.get = function*() {
	if (this.session.user) {
		let userInfo = yield getPath(this.session.user);
		if (userInfo == null) {
			yield this.render('login.ejs', {
				msg: '账号尚未初始化成功,请稍后登陆'
			});
			return;
		}
		yield this.render('index.ejs', {
			userInfo: userInfo,
			address: this.session.user.address
		});
		return;
	}
	yield this.render('login.ejs', {
		msg: ''
	});
}

exports.post = function*() {
	let parts = parse(this);
	let pwd, part
	let stream = new streamBuffers.WritableStreamBuffer()
	while (part = yield parts) {
		if (part != null)
			if (!(part instanceof Array)) {
				part.pipe(stream);
			} else {
				pwd = part[1];
				console.log("password value is " + pwd);
			}
	}
	let data = stream.getContents().toString();
	data = util.decode(data, pwd);
	if (data) {
		try {
			let account = JSON.parse(data);
			console.log(account)
			let userInfo = yield getPath(account);
			if (userInfo) {
				this.session.user = account;
				yield this.render('index.ejs', {
					userInfo: userInfo,
					address: this.session.user.address
				});
			} else {
				yield this.render('login.ejs', {
					msg: '用户不存在或密码错误'
				});
			}
		} catch (e) {
			yield this.render('login.ejs', {
				msg: '用户不存在或密码错误'
			});
		}

	}

}

function* getPath(account) {
	try {
		let userInfo = yield api.getSettings(account.address);
		userInfo = JSON.parse(userInfo.memos[0].data);
		return userInfo;
	} catch (e) {
		return null;
	}

}