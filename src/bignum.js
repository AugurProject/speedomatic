"use strict";

var BigNumber = require("bignumber.js");
var isHex = require("./is-hex");
var prefixHex = require("./prefix-hex");
var wrap = require("./wrap");

function bignum(n, encoding, isWrapped) {
  var bn, len;
  if (n !== null && n !== undefined && n !== "0x" && !n.error && !n.message) {
    switch (n.constructor) {
      case BigNumber:
        bn = n;
        break;
      case Number:
        bn = new BigNumber(n, 10);
        break;
      case String:
        try {
          bn = new BigNumber(n, 10);
        } catch (exc) {
          if (isHex(n)) {
            bn = new BigNumber(n, 16);
          } else {
            return n;
          }
        }
        break;
      case Array:
        len = n.length;
        bn = new Array(len);
        for (var i = 0; i < len; ++i) {
          bn[i] = bignum(n[i], encoding, isWrapped);
        }
        break;
      default:
        if (isHex(n)) {
          bn = new BigNumber(n, 16);
        } else {
          bn = new BigNumber(n, 10);
        }
    }
    if (bn !== undefined && bn !== null && bn.constructor === BigNumber) {
      if (isWrapped) bn = wrap(bn);
      if (encoding) {
        if (encoding === "number") {
          bn = bn.toNumber();
        } else if (encoding === "string") {
          bn = bn.toFixed();
        } else if (encoding === "hex") {
          bn = prefixHex(bn.floor().toString(16));
        }
      }
    }
    return bn;
  }
  return n;
}

module.exports = bignum;
