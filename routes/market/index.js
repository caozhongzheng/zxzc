'use strict'

const api = global.api;
const config = global.config
const pa = require('../../lib/rippleAPI');
const util = require('../../lib/util');
const _ = require('lodash');
const maxamount = '99999999999999';

exports.get = function*() {
    let info = this.query.info;
    let findQuery = this.query.currency;
    let balances;
    if (info) {
        info = info.split(';');
        balances = [{
            currency: info[1],
            counterparty: info[0]
        }]
    } else {
        balances = yield api.getBalances(config.assetAddress);
    }
    let friends = {};
    let results = [];
    for (let i = 0; i < balances.length; i++) {
        if (balances[i].currency !== 'ZXC' && balances[i].currency !== 'XRP') {
            let orderbook = {
                "base": {
                    "currency": balances[i].currency,
                    "counterparty": balances[i].counterparty
                },
                "counter": {
                    "currency": "ZXC",
                    "counterparty": config.zxcAddress
                }
            };
            let orderBooks = yield api.getOrderbook(balances[i].counterparty, orderbook);
            if (orderBooks.bids.length > 0 || orderBooks.asks.length > 0) {
                let rs = {
                    currency: balances[i].currency,
                    counterparty: balances[i].counterparty
                };
                let info = yield pa.getPriceAndName(balances[i].counterparty);
                rs.price = info[0];
                rs.name = info[1];
                rs.sell = [];
                rs.buy = [];
                rs.sellsum = 0;
                rs.buysum = 0;
                if (orderBooks.bids.length > 0) {
                    for (let j = 0; j < orderBooks.bids.length; j++) {
                        let sp = orderBooks.bids[j].specification;
                        rs.buy.push({
                            price: ((sp.totalPrice.value * 1000) / (sp.quantity.value * 1000)).toFixed(2),
                            value: (sp.quantity.value*1).toFixed(2)
                        });
                        rs.buysum += (sp.quantity.value * 1);
                    }
                }
                rs.buy.sort(function(a, b) {
                    return b.price - a.price;
                })
                rs.sell = rs.sell.slice(0, 5);
                if (orderBooks.asks.length > 0) {
                    for (let j = 0; j < orderBooks.asks.length; j++) {

                        let sp = orderBooks.asks[j].specification;
                        rs.sell.push({
                            price: ((sp.totalPrice.value * 1000) / (sp.quantity.value * 1000)).toFixed(2),
                            value: (sp.quantity.value*1).toFixed(2)
                        });
                        rs.sellsum += (sp.quantity.value * 1);
                    }
                }
                rs.sell.sort(function(a, b) {
                    return a.price - b.price;
                })
                rs.buy = rs.buy.slice(0, 5);
                for (let k = 0; k < 5; k++) {
                    if (!rs.buy[k]) {
                        rs.buy[k] = {
                            price: '-',
                            value: '-'
                        }
                    }
                    if (!rs.sell[k]) {
                        rs.sell[k] = {
                            price: '-',
                            value: '-'
                        }
                    }
                }
                console.log(rs)
                results.push(rs)
            }
        }
    }
    if (info) {
        let data = results[0];
        let bs = yield api.getBalances(this.session.user.address, {
            counterparty: data.counterparty
        });
        if(bs.length>0){
            data.isHave = true;
        }else{
            data.isHave = false;
        }
        yield this.render('/market/detail', {
            data: data
        });
    } else {
        let datas = [];
        if(findQuery){
            for (var i = 0; i < results.length; i++) {
                if(results[i].currency == findQuery){
                    datas.push(results[i]);
                }
            }
        }else{
            datas = results;
        }
        yield this.render('/market/index', {
            results: datas
        });
    }

};

exports.post = function*() {

    this.response.body = '资产扩容完成'

}