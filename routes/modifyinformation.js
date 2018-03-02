'use strict'
const api = global.api;

const co = require('co');
const util = require('util');
const pa = require('../lib/rippleAPI');
exports.get = function*() {


    let settings = yield api.getSettings(this.session.user.address);
    let userInfo = JSON.parse(settings.memos[0].data);

    console.log(" information"+userInfo);

    yield this.render('modifyinformation', {
        information:userInfo
    });
};


exports.post = function*() {

    let memos = (yield api.getSettings(this.session.user.address)).memos;
    let userInfo = JSON.parse(memos[0].data);

    for (var key in this.request.body) {
        userInfo[key] = this.request.body[key];
    }
    memos[0].data = JSON.stringify(userInfo);
    let settings = {
        "domain": "www.peersafe.com",
        "memos": memos
    };
    console.log(memos)
    yield pa.PaymentSettings(this.session.user, settings);
    this.response.body ='tesSUCCESS';
    // this.redirect('/index');



}