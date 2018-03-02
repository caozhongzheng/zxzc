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
    for (let i = 0; i < balances.length; i++) {
        if (balances[i].currency != 'ZXC' && balances[i].currency != 'XRP') {
            query.push(pa.getAssetInfo(balances[i].counterparty, this.session.user));
            values.push(balances[i]);
        }
    }
    let assets = yield query;
    let result = [];
    for (let i = 0; i < assets.length; i++) {
        if (assets[i] && assets[i].secret) {
            assets[i].value = values[i].value;
            delete assets[i].secret;
            let counterpartyInfo = yield api.getBalances(assets[i].address, {
                currency: assets[i].code
            });
            let allAssets = 0;
            if (counterpartyInfo) {
                for (let j = 0; j < counterpartyInfo.length; j++) {

                    allAssets += counterpartyInfo[j].value * (-1);
                }
            }
            assets[i].allAssets = allAssets;
            result.push(assets[i]);
        }

    }
    console.log(result)
    yield this.render('/expansionAsset/index', {
        assets: result,
        friends: friends,
        msg: undefined
    });
};

exports.post = function*() {
    let data = this.request.body;
    console.log(data);
    let issuer = yield pa.getAssetInfo(data.counterparty, this.session.user);
    console.log(issuer);
    //给原始股东打钱
    let counterpartyInfo = yield api.getBalances(data.counterparty, {
        currency: data.currency
    });
    let leftMoney = data.addAssets * 1;
    data.asset.forEach(function(item) {
        if (item != '') {
            leftMoney -= (item * 1)
        }
    })
    for (let i = 0; i < counterpartyInfo.length; i++) {
        if (counterpartyInfo[i].counterparty != this.session.user.address) {
            let value = parseInt(counterpartyInfo[i].value * (-1) * (data.rate * 1));
            let payment = {
                source: {
                    address: data.counterparty,
                    maxAmount: {
                        value: maxamount,
                        currency: data.currency,
                        counterparty: data.counterparty
                    }
                },
                destination: {
                    address: counterpartyInfo[i].counterparty,
                    amount: {
                        value: value + '',
                        currency: data.currency,
                        counterparty: data.counterparty
                    }
                }
            };
            if (value != 0) {
                yield pa.Payment(payment, issuer.secret);
                leftMoney -= value;

            }

        }
    }
    let payment1 = {
        source: {
            address: data.counterparty,
            maxAmount: {
                value: maxamount,
                currency: data.currency,
                counterparty: data.counterparty
            }
        },
        destination: {
            address: this.session.user.address,
            amount: {
                value: leftMoney + '',
                currency: data.currency,
                counterparty: data.counterparty
            }
        }
    };
    console.log('leftMoney',leftMoney);
    yield pa.Payment(payment1, issuer.secret);
    //给单个用户打钱
    for (let i = 0; i < data.asset.length; i++) {
        if (data.asset[i] != '') {
            let balances = yield api.getBalances(data.address[i], {
                counterparty: data.counterparty
            });
            if (balances.length > 0) {
                let payment = {
                    source: {
                        address: data.counterparty,
                        maxAmount: {
                            value: maxamount,
                            currency: data.currency,
                            counterparty: data.counterparty
                        }
                    },
                    destination: {
                        address: data.address[i],
                        amount: {
                            value: data.asset[i],
                            currency: data.currency,
                            counterparty: data.counterparty
                        }
                    }
                }
                yield pa.Payment(payment, issuer.secret);

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
                            address: issuer.address,
                            maxAmount: {
                                value: maxamount,
                                currency: data.currency,
                                counterparty: data.counterparty
                            }
                        },
                        destination: {
                            address: thirdAccount.address,
                            amount: {
                                value: data.asset[i],
                                currency: data.currency,
                                counterparty: data.counterparty
                            }
                        }
                    }
                    // console.log(paymentThird)
                yield pa.ensureSuccess(pa.Payment, [paymentThird, issuer.secret], 1000);
                console.log('把要登记的资产先转移给第三方账户');
                //设置三方交易账户
                let settings = {
                    "signers": {
                        "threshold": 2,
                        "weights": [{
                            "address": issuer.address,
                            "weight": 1
                        }, {
                            "address": data.address[i],
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
                        address: data.address[i],
                        amount: {
                            value: data.asset[i],
                            currency: data.currency,
                            counterparty: data.counterparty
                        }
                    }
                }

                let prepared = yield api.preparePayment(thirdAccount.address, payment1, {
                    maxLedgerVersion: null,
                    signersCount: 2
                });
                let signedRet = api.signAs(prepared.txJSON, issuer);
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
                            address: data.address[i],
                            amount: {
                                value: '0.0001',
                                currency: 'XRP'
                            },
                            tag: config.tag.expansion
                        },
                        memos: [{
                            "data": ''
                        }, {
                            "data": JSON.stringify(signedRet)
                        }]
                    }
                    // console.log(payment2)
                yield pa.Payment(payment2, this.session.user.secret);
            }
        }
    }
    // 做一笔交易，记录扩容信息
    let payment = {
        source: {
            address: data.counterparty,
            maxAmount: {
                value: maxamount,
                currency: 'XRP'
            }
        },
        destination: {
            address: this.session.user.address,
            amount: {
                value: '0.0001',
                currency: 'XRP'
            },
            tag: config.tag.expansion
        },
        memos: [{
            "data": JSON.stringify(data)
        }]
    };
    yield pa.Payment(payment, issuer.secret);
    this.response.body = '资产扩容完成'

}