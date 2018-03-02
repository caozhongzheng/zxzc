'use strict'
const api = global.api;
const config = global.config
const pa = require('../../lib/rippleAPI');
const _ = require('lodash');
const maxamount = '99999999999999';


exports.get = function*() {
    console.log(this.session.user)
    let balances = yield api.getBalances(this.session.user.address);
    console.log(balances)
    for (let i = 0; i < balances.length; i++) {
        if (balances[i].currency !== 'XRP' && balances[i].currency !== 'ZXC' && balances[i].value * 1 > 0) {
            let info = yield pa.getPriceAndName(balances[i].counterparty);
            balances[i].price = info[0];
            balances[i].name = info[1];
        }
    }

    let userInfo = (yield api.getSettings(this.session.user.address)).memos[0].data;
    userInfo = JSON.parse(userInfo);
    let query = {
        types: ['payment'],
        initiated: false,
        earliestFirst: true
    };
    if (userInfo.ltd) {
        query.start = userInfo.ltd
    };
    let trans = yield api.getTransactions(this.session.user.address, query);
    let ltd = ''; //最近一笔三方交易id
    for (var i = 0; i < trans.length; i++) {
        if (trans[i].specification.destination.tag &&
            (trans[i].specification.destination.tag == config.tag.register ||
                trans[i].specification.destination.tag == config.tag.transfer ||
                trans[i].specification.destination.tag == config.tag.expansion)) {
            if (trans[i].specification.memos.length == 2) {
                //获取三方交易信息
                if (ltd === '') {
                    ltd = trans[i].id;
                }
                //信任该资产
                let info = JSON.parse(trans[i].specification.memos[1].data);
                info = info.Amount;
                info.id = trans[i].id;
                let trustline = {
                    currency: info.currency,
                    counterparty: info.issuer,
                    limit: maxamount,
                    qualityIn: 1,
                    qualityOut: 1,
                    ripplingDisabled: true,
                    frozen: false,
                    memos: [{
                        type: 'NEW',
                        format: 'plain/text',
                        data: JSON.stringify(info)
                    }]
                };
                yield pa.PaymentTrustline(this.session.user, trustline);
            }

        }
    }
    if (ltd != '') {
        //如果有新的资产,就跟新账户信息
        userInfo.ltd = ltd;
        let settings = {
            "domain": "www.peersafe.com",
            "memos": [{
                "type": "USERINFO",
                "format": "plain/text",
                "data": JSON.stringify(userInfo)
            }]
        };
        yield pa.PaymentSettings(this.session.user, settings);
        yield pa.sleep(3000);
    }


    let trustlines = yield api.getTrustlines(this.session.user.address);
    let results = [];
    for (var i = 0; i < trustlines.length; i++) {
        if (trustlines[i].specification.memos && trustlines[i].specification.memos[0].type === 'NEW') {
            let dd = JSON.parse(trustlines[i].specification.memos[0].data);
            let info = yield pa.getPriceAndName(dd.issuer);
            dd.price = info[0];
            dd.name = info[1];
            results.push(dd);
        }
    }
    console.log(balances)
    yield this.render('/account/index', {
        balances: balances,
        trustlines: results
    });
};

/* description              process account form that submitted 
 * @param void          
 * @return                  
 * @date                    2016-07-05
 * @author                  db.liu
 */
exports.post = function*() {
    let data = this.request.body;

    let tran = yield api.getTransaction(data.id);
    let signedRet = api.signAs(tran.specification.memos[1].data, this.session.user);
    signedRet = api.sortSigners(signedRet);
    let resultCode = yield api.submit(signedRet.signedTransaction);
    console.log(resultCode)
    if (resultCode.resultCode == 'tesSUCCESS') {
        let trustline = {
            currency: data.code,
            counterparty: data.address,
            limit: maxamount,
            qualityIn: 1,
            qualityOut: 1,
            ripplingDisabled: true,
            frozen: false,
            memos: [{
                type: 'test',
                format: 'plain/text',
                data: ''
            }]
        };
        yield pa.PaymentTrustline(this.session.user, trustline);
        yield pa.sleep(3000);
        this.redirect('/account/index');
    }
};