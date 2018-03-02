'use strict';
var _ = require('lodash');
var path = require('path');
var basePath = path.join(require.resolve('ripple-lib'), '../ledger/parse/utils');
var utils = require(basePath);

// rippled 'account_lines' returns a different format for
// trustlines than 'tx'
function parseAccountTrustline(trustline) {
  if (trustline.memos) {
    trustline.Memos = trustline.memos;
  }
  var specification = utils.removeUndefined({
    limit: trustline.limit,
    currency: trustline.currency,
    counterparty: trustline.account,
    qualityIn: utils.parseQuality(trustline.quality_in) || undefined,
    qualityOut: utils.parseQuality(trustline.quality_out) || undefined,
    ripplingDisabled: trustline.no_ripple || undefined,
    frozen: trustline.freeze || undefined,
    authorized: trustline.authorized || undefined,
    memos: utils.parseMemos(trustline)
  });

  // rippled doesn't provide the counterparty's qualities
  var counterparty = utils.removeUndefined({
    limit: trustline.limit_peer,
    ripplingDisabled: trustline.no_ripple_peer || undefined,
    frozen: trustline.freeze_peer || undefined,
    authorized: trustline.peer_authorized || undefined,
  });
  var state = {
    balance: trustline.balance
  };
  return {
    specification: specification,
    counterparty: counterparty,
    state: state
  };
}

module.exports = parseAccountTrustline;