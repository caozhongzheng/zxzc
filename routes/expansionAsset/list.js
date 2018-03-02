'use strict'
const config = global.config;
const api = global.api

exports.get = function*() {
    let trans = yield api.getTransactions(this.session.user.address, {
        types: ['payment']
    });
    let data = []
    for (let i = 0; i < trans.length; i++) {
        if (trans[i].specification.destination.tag === config.tag.expansion && trans[i].specification.memos[0].data) {
            console.log(trans[i])
            let info = JSON.parse(trans[i].specification.memos[0].data);
            info.time = new Date(trans[i].outcome.timestamp).toLocaleString();
            data.push(info)
        }
    }

    console.log(data)
    yield this.render("/expansionAsset/list", {
        data: data
    })

};