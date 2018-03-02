'use strict'

const api = global.api;
const config = global.config
const pa = require('../../lib/rippleAPI');
const util = require('../../lib/util');
const _ = require('lodash');
const maxamount = '99999999999999';


exports.get = function*() {
   if (this.query.code) {
      // try {
      let data = {
         codeordz: this.query.code,
         address: this.query.address
      };
      console.log(data)
      if ((data.codeordz[0] == 'r') && (data.codeordz.length < 35)) { //simplely judge by length
         let address = this.query.code;
         /*
          功能：取出余额
          传入参数：地址address和密钥secret
          返回：余额对象数组*/
         let balances = yield api.getBalances(address);
         for (let i = 0; i < balances.length; i++) {
            balances[i].timestamp = "";
            try {
               if ((balances[i].currency != "XRP") && (balances[i].currency != "ZXC")) {
                  let info = yield pa.getPriceAndName(balances[i].counterparty);
                  balances[i].price = info[0];
               }
            } catch (e) {
               console.log(e);
            }
         }
         yield this.render('/stockQuery/balance', {
            balances: balances
         });
      } else if (data.codeordz.length == 3) {
         let code = data.codeordz;
         if (!data.address) {
            let balances = yield api.getBalances(config.assetAddress, {
               currency: code
            });
            if (balances.length > 0) {
               for (let i = 0; i < balances.length; i++) {
                  let assetInfo = yield pa.getAssetInfo(balances[i].counterparty);
                  let bb = yield api.getBalances(balances[i].counterparty, {
                     currency: code
                  });
                  balances[i].value = 0;
                  for (var j = 0; j < bb.length; j++) {
                     balances[i].value += bb[j].value * -1;
                  }
                  balances[i].name = assetInfo.name;
               }
               yield this.render('/stockQuery/code', {
                  result: balances,
                  name: code
               });
               return;
            } else {
               this.response.body = '<div style="margin-left:110px;color:#ff0000">要查询的钱包地址或者资产代码不存在<div>';
               return;
            }

         }
         let balances = yield api.getBalances(data.address, {
            currency: data.codeordz
         });
         balances = balances.sort(function(a, b) {
            return (a.value * 1) - (b.value * 1);
         })
         let result = [];
         for (let i = 0; i < balances.length; i++) {

            if (balances[i].counterparty !== config.assetAddress) {
               if (i == 9) {
                  break;
               }
               let acccoutnInfo = yield pa.getUserInfo(balances[i].counterparty);
               if (acccoutnInfo) {
                  balances[i].name = acccoutnInfo.name;
                  let color = randomColor();
                  balances[i].color = colorHexToRGB(color);
                  balances[i].value = parseInt(balances[i].value)
                  result.push(balances[i]);
               }
            }

         }
         var otherTotal = 0;
         for (let i = 9; i < balances.length; i++) {
            otherTotal += parseInt(balances[i].balance.value);
         }
         if (otherTotal > 0) {
            result.push({
               name: '其它',
               value: otherTotal,
               color: colorHexToRGB(randomColor())
            })
         }
         if (balances.length > 0) {
            yield this.render('/stockQuery/details', {
               result: JSON.stringify(result),
               name: code,
               address: data.address
            });
         } else {
            this.response.body = '<div style="margin-left:110px;color:#ff0000">要查询的钱包地址或者资产代码不存在<div>';

         }

      } else {
         this.response.body = '<div style="margin-left:110px;color:#ff0000">要查询的钱包地址或者资产代码不存在<div>';
      }
      // } catch (e) {
      //    console.log(e)
      //    this.response.body = '<div style="margin-left:110px;color:#ff0000">要查询的钱包地址或者资产代码不存在<div>';
      // }
   } else {
      yield this.render('/stockQuery/index', {});
   }

};

function randomColor() {
   var colorStr = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase();
   return "#" + "000000".substring(0, 6 - colorStr) + colorStr;
}
/**
 * 十六进制颜色转换为RGB颜色
 * @param color 要转换的十六进制颜色
 * @return RGB颜色
 */
function colorHexToRGB(color) {
   color = color.toUpperCase();
   var regexpHex = /^#[0-9a-fA-F]{3,6}$/; //Hex
   if (regexpHex.test(color)) {
      var hexArray = new Array();
      var count = 1;
      for (var i = 1; i <= 3; i++) {
         if (color.length - 2 * i > 3 - i) {
            hexArray.push(Number("0x" + color.substring(count, count + 2)));
            count += 2;
         } else {
            hexArray.push(Number("0x" + color.charAt(count) + color.charAt(count)));
            count += 1;
         }
      }
      return "RGB(" + hexArray.join(",") + ")";
   } else {
      return color;
   }
}
exports.post = function*() {


}