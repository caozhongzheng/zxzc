'use strict'

exports.get = function*() {
	this.session.user = null;
	yield this.render('login.ejs', {
		msg: ''
	});
}