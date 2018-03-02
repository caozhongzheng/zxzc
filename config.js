'use strict'
var rippleAddress = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
  rippleSecret = 'snoPBrXtMeMyMHUVTgbuqAfg1SUTb',
  rippleZXCAddress = 'rsadxc3pw976e3hfaxUijhbR3ye2orJS6x',
  rippleZXCSecret = 'snyjxeAxrSBbGGUdC36CxHQa3neLj';
global.config = {
  port: process.env.PORT || 3000,
  rippleServerIp: 'ws://101.201.220.73:6006',
  rippleAddress: rippleAddress,
  rippleSecret: rippleSecret,
  rippleZXCAddress: rippleZXCAddress,
  rippleZXCSecret: rippleZXCSecret,
  rippleZXCoin: '100',
  rippleInstructions: {
    maxLedgerVersionOffset: 5
  },
  routerCacheConf: {
    '/': {
      expire: 10 * 1000,
      condition: function() {
        return !this.session || !this.session.user;
      }
    }
  },
  payment: {
    source: {
      address: rippleAddress,
      maxAmount: {
        value: '300000000',
        currency: 'XRP'
      }
    },
    destination: {
      address: '',
      amount: {
        value: '100',
        currency: 'XRP'
      }
    }
  },
  trustline: {
    currency: "ZXC",
    counterparty: rippleZXCAddress,
    limit: "1000000",
    qualityIn: 1,
    qualityOut: 1,
    ripplingDisabled: true,
    frozen: false,
    memos: [{
      type: 'TRUSTLINE',
      format: '',
      data: ''
    }]
  },
  storePayment: {
    source: {
      address: '',
      maxAmount: {
        value: '300000',
        currency: 'XRP'
      }
    },
    destination: {
      address: rippleAddress,
      amount: {
        value: '0.1',
        currency: 'XRP'
      }
    },
    memos: [{
      type: 'ACCOUNTINFOSET',
      format: '',
      data: ''
    }]
  },
  zxcPayment: {
    source: {
      address: rippleZXCAddress,
      maxAmount: {
        value: '300000000',
        currency: "ZXC"
      }
    },
    destination: {
      address: '',
      amount: {
        value: 100,
        currency: "ZXC"
      }
    }
  }
};
