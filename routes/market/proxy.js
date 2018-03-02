/**
 * Created by hsf on 16/6/12.
 */
'use strict';
const api = global.api;
const config = global.config
const pa = require('../../lib/rippleAPI');
const util = require('../../lib/util');
const _ = require('lodash');
const maxamount = '99999999999999';



exports.get = function*() {
    let map = {};
    let sum;
    var ret = yield api.getOrders(this.session.user.address);
    var orders = [];
    for (let index in ret) //过滤交易基础货币为XRP的单子
    {
        if ((ret[index].specification.quantity.currency != "XRP") && (ret[index].specification.totalPrice.currency != "XRP")) {
            ret[index].price = 0;
            orders.push(ret[index]);
        }
    }

    let localaddress = '';


    /*
     功能：取出余额
     传入参数：地址address和密钥secret
     返回：余额对象数组*/
    let balances = yield api.getBalances(this.session.user.address);

    for (let i in orders) {
        let info = yield pa.getPriceAndName(orders[i].specification.quantity.counterparty);
        orders[i].price = info[0]
    }

    function sortSequence(a, b) //排序函数
    {
        return b.properties.sequence * 1 - a.properties.sequence * 1;
    }
    orders.sort(sortSequence);

    console.log('-------------orders------------------');
    // console.log(orders);
    yield this.render('/market/proxy', {
        orders: orders
    });

};