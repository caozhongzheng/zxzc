'use strict'
const config = global.config;
const api = global.api

exports.get = function*() {
    let trans = yield api.getTransactions(this.session.user.address, {
        types: ['payment'],
        initiated: false
    });
    let data = []
    for (var i = 0; i < trans.length; i++) {
        if (trans[i].specification.destination.tag === config.tag.create) {
            let info = JSON.parse(trans[i].specification.memos[0].data);
            info.time = new Date(trans[i].outcome.timestamp).toLocaleString();
            data.push(info)
        }
    }
    yield this.render("/createAsset/list", {
        data: data
    })

};