'use strict'
const api = global.api;
const config = global.config
const pa = require('../../lib/rippleAPI');
const util = require('../../lib/util');
const _ = require('lodash');
const maxamount = '99999999999999';
exports.get = function*() {
  var balances = yield api.getBalances(this.session.user.address);
  let data = []
  yield this.render('/createAsset/index', {
    msg: '',
    balances: balances,
    maxamount: maxamount
  });
};


exports.post = function*() {
  try {
    let data = this.request.body;
    // 1.生成资产发行账户
    let issuer = api.generateAddress();
    //2.给账户打ripple币
    let payment = {
      source: {
        address: config.rippleAddress,
        maxAmount: {
          value: '10000',
          currency: 'XRP'
        }
      },
      destination: {
        address: issuer.address,
        amount: {
          value: '1000',
          currency: 'XRP'
        }
      }
    };
    yield pa.Payment(payment, config.rippleSecret);
    console.log('给账户打ripple币');
    //设置资产发行方信息
    data.secret = util.encode(JSON.stringify({
      address: this.session.user.address,
      secret: issuer.secret
    }), this.session.user.secret);
    let userInfo = {
      "domain": "www.peersafe.com",
      "memos": [{
        "type": "USERINFO",
        "format": "plain/text",
        "data": JSON.stringify(data)
      }]
    };
    yield pa.PaymentSettings(issuer, userInfo);

    yield pa.PaymentSettings(issuer, {
      "defaultRipple": true
    })
    console.log('设置资产发行方信息');
    //信任资产发行方
    let trustline = {
      currency: data.code,
      counterparty: issuer.address,
      limit: maxamount,
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
    yield pa.PaymentTrustline(this.session.user, trustline);
    console.log('信任资产发行方');


    //给用户打资产
    let payment1 = {
      source: {
        address: issuer.address,
        maxAmount: {
          value: maxamount,
          currency: data.code
        }
      },
      destination: {
        address: this.session.user.address,
        amount: {
          value: data.value,
          currency: data.code
        }
      }
    };
    yield pa.ensureSuccess(pa.Payment, [payment1, issuer.secret], 1000);
    console.log('给用户打资产')
      //记录创设记录
    delete data.secret;
    let payment2 = {
      source: {
        address: issuer.address,
        maxAmount: {
          value: '10000',
          currency: 'XRP'
        }
      },
      destination: {
        address: this.session.user.address,
        amount: {
          value: '0.0001',
          currency: 'XRP'
        },
        tag: config.tag.create
      },
      "memos": [{
        "type": "CREATE",
        "format": "plain/text",
        "data": JSON.stringify(data)
      }]
    };
    yield pa.Payment(payment2, issuer.secret);
    console.log('记录创设记录')
    let trustline1 = {
      currency: data.code,
      counterparty: issuer.address,
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
    let account = {
      address: config.assetAddress,
      secret: config.assetSecret
    };
    yield pa.PaymentTrustline(account, trustline1);

    console.log('资产总账户信任资产发行方')
    this.response.body = '资产创设完成'
  } catch (e) {
    console.log(e);
    this.response.body = '资产创设失败';
  }
}