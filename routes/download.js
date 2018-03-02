'use strict'

var fs = require('fs');
var path = require('path');

exports.get = function*() {
    if (!this.session.secretFile) {
        return;
    }
    this.set('Content-disposition', 'attachment;filename=peersafe_wallet');
    this.body = this.session.secretFile;
    this.session.secretFile = null
    return;

};