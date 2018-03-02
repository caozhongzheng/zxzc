'use strict';

const api = global.api;
const config = global.config
const pa = require('../../lib/rippleAPI');


exports.post = function*() {
    let sequence = this.request.body.sequence;
    console.log('sequence:' + sequence);

    let orderCancellation = {
        orderSequence: parseInt(sequence)
    };
    yield pa.PaymentCancel(this.session.user, orderCancellation);
    this.response.body = true;
};