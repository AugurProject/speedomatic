"use strict";

var BigNumber = require("bignumber.js");
var bignum = require("./bignum");
var prefixHex = require("./prefix-hex");
var wrap = require("./wrap");
var FXP_ONE = require("./constants").FXP_ONE;

function fix(n, encoding, isWrapped) {
  var fixed;
  if (n && n !== "0x" && !n.error && !n.message) {
    if (encoding && n.constructor === String) {
      encoding = encoding.toLowerCase();
    }
    if (Array.isArray(n)) {
      var len = n.length;
      fixed = new Array(len);
      for (var i = 0; i < len; ++i) {
        fixed[i] = fix(n[i], encoding);
      }
    } else {
      if (!BigNumber.isBigNumber(n)) {
        n = bignum(n);
      }
      fixed = n.multipliedBy(FXP_ONE).integerValue();
      if (isWrapped) fixed = wrap(fixed);
      if (encoding) {
        if (encoding === "string") {
          fixed = fixed.toFixed();
        } else if (encoding === "hex") {
          if (BigNumber.isBigNumber(fixed)) {
            fixed = fixed.toString(16);
          }
          fixed = prefixHex(fixed);
        }
      }
    }
    return fixed;
  }
  return n;
}

module.exports = fix;
