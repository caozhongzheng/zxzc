var crypto = require('crypto');


function uid() {
    return Math.random().toString(36).slice(2);
}

/**
 * 加密函数
 * @param text  需要加密的内容
 * @param key   秘钥
 * @returns {Query|*}  密文
 */
function encode(text, key) {
    var secret = key;
    var cipher = crypto.createCipher('aes-256-cbc', secret);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
module.exports.encode = encode;

/**
 * 解密函数
 * @param text  需要解密的内容
 * @param key   秘钥
 * @returns {Query|*}
 */
function decode(text, key) {
    var dec;
    try {
        var secret = key;
        var decipher = crypto.createDecipher('aes-256-cbc', secret);
        dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
    } catch (e) {}
    return dec;
}
module.exports.decode = decode;
exports.uid = uid;