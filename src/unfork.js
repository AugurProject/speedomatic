"use strict";

var BigNumber = require("bignumber.js");
var bignum = require("./bignum");
var padLeft = require("./pad-left");
var prefixHex = require("./prefix-hex");
var constants = require("./constants");

function unfork(forked, prefix) {
  if (forked !== null && forked !== undefined && forked.constructor !== Object) {
    var unforked = bignum(forked);
    if (unforked.constructor === BigNumber) {
      var superforked = unforked.plus(constants.UINT256_MAX_VALUE);
      if (superforked.gte(constants.BYTES_32) && superforked.lt(constants.UINT256_MAX_VALUE)) {
        unforked = superforked;
      }
      if (forked.constructor === BigNumber) return unforked;
      unforked = padLeft(unforked.toString(16));
      if (prefix) unforked = prefixHex(unforked);
      return unforked;
    }
    throw new Error("abi.unfork failed (bad input): " + JSON.stringify(forked));
  }
  throw new Error("abi.unfork failed (bad input): " + JSON.stringify(forked));
}

module.exports = unfork;
