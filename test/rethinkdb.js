'use strict'

const r = require('rethinkdb');
const co = require('co');

co(function*() {
  //集群有两台机器db1,db2
  try {
    let db1 = yield r.connect({
      host: 'localhost',
      port: '28015',
      db: 'caipeng',
    });
    console.log(db1.clientPort(), db1.clientAddress());

    // let result = yield r.table('hep').insert({
    //   id:1,
    //   date: new Date(), //时间
    //   outIn: 300, //收入
    //   times: 500, //局数
    //   allin: 10, //allin次数
    //   out: 200, //输钱的次数
    //   in : 103 //赢钱次数
    // }).run(db1);
    let rs = yield r.table('hep').run(db1);
    // console.log( yield rs.toArray())
    let rs1 = yield r.table('hep').filter({ in : 100
    }).run(db1);
    console.log(yield rs.toArray())
  } catch (e) {
    console.log(e)
  }

})