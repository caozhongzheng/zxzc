/**
 * Created by hsf on 16/6/12.
 */
'use strict'

const savefile = require('../lib/core');
const comm = require('../lib/comm');
const pa = require('../lib/rippleAPI');

exports.get = function*() {
    var login = []
    yield this.render('loginRecreate', {
        login: login
    });
};


exports.post = function*() {
    try {
        var data = this.request.body;
        var privatekey = data.privatekey;
        var password = data.password1;
        console.log(password, privatekey)
        if (password && privatekey) {
            console.log(privatekey)
            let account = pa.generateAddress(privatekey);
            let user = {
                address: account.address,
                secret: account.secret
            }
            this.session.user = user;
            let enuser = comm.encode(JSON.stringify(user), this.request.body.password1);

            // let downfile = savefile.uid();
            // console.log(enuser,downfile)
            // savefile.saveJSON(enuser, downfile);
            let balances = yield api.getBalances(user.address, user.secret, {
                currency: 'XRP'
            });
            let entity = 1;
            if (!balances[0].entity) {
                entity = 2
            }
            this.session.secretFile = enuser;
            yield this.render('registerSecond', {
                account: account,
                entity: entity,
                rec: '1'
            });

        } else {
            yield this.render('loginRecreate');
        }
    } catch (e) {
        console.log(e);
        yield this.render('loginRecreate');
    }

}