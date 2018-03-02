'use strict'
const api = global.api;
const config = global.config
const pa = require('../../lib/rippleAPI');
const util = require('../../lib/util');
const _ = require('lodash');
const maxamount = '99999999999999';

exports.get = function*() {
    let friends = {};
    let balances = yield api.getBalances(this.session.user.address);
    let query = [];
    let values = [];
    let zxcInfo = {};
    for (var i = 0; i < balances.length; i++) {
        if (balances[i].currency != 'ZXC' && balances[i].currency != 'XRP') {
            query.push(pa.getAssetInfo(balances[i].counterparty, this.session.user));
            values.push(balances[i]);
        }
        if(balances[i].currency === 'ZXC'){
            zxcInfo.value = balances[i].value;
            zxcInfo.code = balances[i].currency;
            zxcInfo.counterparty = balances[i].counterparty;
            zxcInfo.address = balances[i].counterparty;
        }
    }
    let assets = yield query;
    let result = [];
    
    for (var i = 0; i < assets.length; i++) {
        if (assets[i]) {
            assets[i].value = values[i].value;
            delete assets[i].secret;
            result.push(assets[i]);
        }

    }
    result.push(zxcInfo)
    yield this.render('/transferAsset/index', {
        assets: result,
        friends: friends,
        msg: undefined
    });
};

exports.post = function*() {
    let data = this.request.body;
    console.log(data);
    let balances = yield api.getBalances(data.address, {
        counterparty: data.counterparty
    });
    if (balances.length > 0) {
        let payment = {
            source: {
                address: this.session.user.address,
                maxAmount: {
                    value: maxamount,
                    currency: data.currency,
                    counterparty: data.counterparty
                }
            },
            destination: {
                address: data.address,
                amount: {
                    value: data.value,
                    currency: data.currency,
                    counterparty: data.counterparty
                },
                tag: config.tag.transfer
            },
            memos: [{
                "data": JSON.stringify(data)
            }]
        }
        console.log(payment)
        yield pa.Payment(payment, this.session.user.secret);
        this.response.body = '资产转移完成'
    } else {
        //生成第三方账户，准备做三方交易
        let thirdAccount = api.generateAddress();
        //给账户打ripple币
        let payment = {
            source: {
                address: config.rippleAddress,
                maxAmount: {
                    value: '10000',
                    currency: 'XRP'
                }
            },
            destination: {
                address: thirdAccount.address,
                amount: {
                    value: '1000',
                    currency: 'XRP'
                }
            }
        };
        yield pa.Payment(payment, config.rippleSecret);
        console.log('给第三方账户打ripple币');
        //第三方账户信任该资产
        let trustline = {
            currency: data.currency,
            counterparty: data.counterparty,
            limit: maxamount,
            qualityIn: 1,
            qualityOut: 1,
            ripplingDisabled: true,
            frozen: false
        };
        yield pa.PaymentTrustline(thirdAccount, trustline);
        console.log('第三方账户信任该资产');
        //把要登记的资产先转移给第三方账户
        let paymentThird = {
            source: {
                address: this.session.user.address,
                maxAmount: {
                    value: maxamount,
                    currency: data.currency,
                    counterparty: data.counterparty
                }
            },
            destination: {
                address: thirdAccount.address,
                amount: {
                    value: data.value,
                    currency: data.currency,
                    counterparty: data.counterparty
                }
            }
        }
        yield pa.ensureSuccess(pa.Payment, [paymentThird, this.session.user.secret], 1000);
        console.log('把要登记的资产先转移给第三方账户');
        //设置三方交易账户
        let settings = {
            "signers": {
                "threshold": 2,
                "weights": [{
                    "address": this.session.user.address,
                    "weight": 1
                }, {
                    "address": data.address,
                    "weight": 1
                }]
            }
        };
        yield pa.PaymentSettings(thirdAccount, settings);
        console.log('设置三方交易账户');
        //通过第三方账户给要登记的账户登记资产
        let payment1 = {
            source: {
                address: thirdAccount.address,
                maxAmount: {
                    value: maxamount,
                    currency: data.currency,
                    counterparty: data.counterparty
                }
            },
            destination: {
                address: data.address,
                amount: {
                    value: data.value,
                    currency: data.currency,
                    counterparty: data.counterparty
                }
            }
        }

        let prepared = yield api.preparePayment(thirdAccount.address, payment1, {
            maxLedgerVersion: null,
            signersCount: 2
        });
        let signedRet = api.signAs(prepared.txJSON, this.session.user);
        console.log('为给要登记的账户做准备工作');
        //给要登记的资产做一笔交易，发送三方交易信息
        let payment2 = {
            source: {
                address: this.session.user.address,
                maxAmount: {
                    value: maxamount,
                    currency: 'XRP'
                }
            },
            destination: {
                address: data.address,
                amount: {
                    value: '0.0001',
                    currency: 'XRP'
                },
                tag: config.tag.transfer
            },
            memos: [{
                "data": JSON.stringify(data)
            }, {
                "data": JSON.stringify(signedRet)
            }]
        }
        yield pa.Payment(payment2, this.session.user.secret);
        console.log('给要登记的资产做一笔交易，发送三方交易信息');
        this.response.body = '资产转移完成'
    }
}