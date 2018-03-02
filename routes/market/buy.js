'use strict'

const api = global.api;
const config = global.config
const pa = require('../../lib/rippleAPI');
const util = require('../../lib/util');
const _ = require('lodash');
const maxamount = '99999999999999';

exports.get = function*() {
    let balances = yield api.getBalances(this.session.user.address);
    let results = [];
    let zxcAsset = 0;
    for (let i = 0; i < balances.length; i++) {
        if (balances[i].currency !== 'XRP' && balances[i].currency !== 'ZXC' && balances[i].value * 1 > 0) {
            let info = yield pa.getPriceAndName(balances[i].counterparty);
            balances[i].price = info[0];
            balances[i].name = info[1];
            results.push(balances[i]);

        }
        if(balances[i].currency == 'ZXC'){
           zxcAsset = balances[i].value;
        }
    }
    yield this.render('/market/buy', {
        balances: results,
        msg: '',
        zxcAsset:zxcAsset
    });
};

exports.post = function*() {
    let data = this.request.body;
    console.log(data)
    let order = {
        "direction": "buy",
        "quantity": {
            "currency": data.currency,
            "counterparty": data.counterparty,
            "value": data.value
        },
        "totalPrice": {
            "currency": "ZXC",
            "counterparty": config.zxcAddress,
            "value": (data.value*1)*(data.price*1)+''
        }
    };

    console.log(order);
    yield pa.PaymentOrder(this.session.user,order);
    this.response.body = '挂单完成';

}
