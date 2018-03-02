'use strict';

var path = require('path');
var basePath = path.join(require.resolve('ripple-lib'), '../transaction/utils');
var utils = require(basePath);
var keypairs = require('ripple-keypairs');
var binary = require('ripple-binary-codec');

var _require = require('ripple-hashes');

var computeBinaryTransactionHash = _require.computeBinaryTransactionHash;

var validate = utils.common.validate;

function computeSignature(tx, privateKey, signAs) {
  var signingData = signAs ? binary.encodeForMultisigning(tx, signAs) : binary.encodeForSigning(tx);
  return keypairs.sign(signingData, privateKey);
}

function signAs(txJSON, account) {
  // var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  // validate.sign({
  //   txJSON: txJSON,
  //   secret: secret
  // });
  // we can't validate that the secret matches the account because
  // the secret could correspond to the regular key

  var tx = JSON.parse(txJSON);
  // if (tx.TxnSignature || tx.Signers) {
  //   throw new utils.common.errors.ValidationError('txJSON must not contain "TxnSignature" or "Signers" properties');
  // }

  var keypair = keypairs.deriveKeypair(account.secret);
  tx.SigningPubKey = '';

  var signer = {
    Account: account.address,
    SigningPubKey: keypair.publicKey,
    TxnSignature: computeSignature(tx, keypair.privateKey, account.address)
  };
  if (tx.Signers) {
    tx.Signers.push({
      Signer: signer
    })
  } else {
    tx.Signers = [{
      Signer: signer
    }];
  }

  return tx;
}

module.exports = signAs;