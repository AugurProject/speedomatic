"use strict";

var BigNumber = require("bignumber.js");
var bignum = require("./bignum");
var prefixHex = require("./prefix-hex");
var FXP_ONE = require("./constants").FXP_ONE;

function unfix(n, encoding) {
  var unfixed;
  if (n && n !== "0x" && !n.error && !n.message) {
    if (encoding) encoding = encoding.toLowerCase();
    if (Array.isArray(n)) {
      var len = n.length;
      unfixed = new Array(len);
      for (var i = 0; i < len; ++i) {
        unfixed[i] = unfix(n[i], encoding);
      }
    } else {
      if (n.constructor === BigNumber) {
        unfixed = n.dividedBy(FXP_ONE);
      } else {
        unfixed = bignum(n).dividedBy(FXP_ONE);
      }
      if (unfixed && encoding) {
        if (encoding === "hex") {
          unfixed = prefixHex(unfixed.round());
        } else if (encoding === "string") {
          unfixed = unfixed.toFixed();
        } else if (encoding === "number") {
          unfixed = unfixed.toNumber();
        }
      }
    }
    return unfixed;
  }
  return n;
}

module.exports = unfix;
