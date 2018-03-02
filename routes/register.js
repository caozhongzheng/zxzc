'use strict'
const api = global.api;
const config = global.config
const pa = require('../lib/rippleAPI');
const util = require('../lib/util');
const _ = require('lodash');
exports.get = function*() {
  yield this.render('register', {
    msg: ''
  });
}
exports.post = function*() {
  let data = this.request.body;
  console.log(data);
  if (data.pwd && data.type) {
    //生成账号
    let account = api.generateAddress();
    console.log('账号生成成功')
    let payment = {
      source: {
        address: config.rippleAddress,
        maxAmount: {
          value: '10000',
          currency: 'XRP'
        }
      },
      destination: {
        address: account.address,
        amount: {
          value: '1000',
          currency: 'XRP'
        }
      }
    };
    yield pa.Payment(payment, config.rippleSecret);
    console.log('给账号打ripple币');
    let userInfo = {
      "domain": "www.peersafe.com",
      "memos": [{
        "type": "USERINFO",
        "format": "plain/text",
        "data": ""
      }]
    };
    let trustline = {
      currency: 'ZXC',
      counterparty: config.zxcAddress,
      limit: '1000000',
      qualityIn: 1,
      qualityOut: 1,
      ripplingDisabled: true,
      frozen: false,
      memos: [{
        type: 'TRUSTLINE',
        format: '',
        data: ''
      }]
    };

    //设置用户信息
    userInfo.memos[0].data = JSON.stringify(_.omit(data, ['pwd']));
    yield pa.PaymentTrustline(account, trustline);
    yield pa.PaymentSettings(account, userInfo);
    this.session.user = account;
    var secretFile = util.encode(JSON.stringify(account), data.pwd);
    this.session.secretFile = secretFile;
    //设置信任众享币
    let time1 = new Date().getTime();
    yield pa.ensureSuccess(pa.PaymentTrustline, [account, trustline], 1000);
    console.log('one:',new Date().getTime() - time1);
    //给账户打100众享币
    let payment1 = {
      source: {
        address: config.zxcAddress,
        maxAmount: {
          value: '10000',
          currency: 'ZXC'
        }
      },
      destination: {
        address: account.address,
        amount: {
          value: '100',
          currency: 'ZXC'
        }
      }
    };
    yield pa.ensureSuccess(pa.Payment, [payment1, config.zxcSecret], 1000);
    console.log('two:',new Date().getTime() - time1);
    yield this.render('registerSecond', {
      account: account,
      rec: 0
    });
  } else {
    return;
  }
}

