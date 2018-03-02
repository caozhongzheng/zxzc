'use strict'
const config = global.config;
const api = global.api

exports.get = function*() {
    let trans = yield api.getTransactions(this.session.user.address, {
        types: ['payment'],
        initiated: true
    });
    let data = []
    for (var i = 0; i < trans.length; i++) {
        if (trans[i].specification.destination.tag === config.tag.transfer && trans[i].outcome.result == 'tesSUCCESS') {
            let info = JSON.parse(trans[i].specification.memos[0].data);
            info.time = new Date(trans[i].outcome.timestamp).toLocaleString();
            info.type = 1;
            data.push(info)
        }
    }
    let trans2 = yield api.getTransactions(this.session.user.address, {
        types: ['payment'],
        initiated: false
    });
    for (var i = 0; i < trans2.length; i++) {
        if (trans2[i].specification.destination.tag === config.tag.transfer && trans2[i].outcome.result == 'tesSUCCESS') {
            let info = JSON.parse(trans2[i].specification.memos[0].data);
            info.address = trans2[i].specification.source.address;
            info.name = JSON.parse((yield api.getSettings(info.address)).memos[0].data).name;

            info.time = new Date(trans2[i].outcome.timestamp).toLocaleString();
            info.type = 0;
            data.push(info)
        }
    }

    yield this.render("/transferAsset/list", {
        data: data
    })

};