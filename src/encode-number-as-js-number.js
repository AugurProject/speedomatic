"use strict";

var bignum = require("./bignum");

function encodeNumberAsJSNumber(s, isWrapped) {
  return bignum(s, "number", isWrapped);
}

module.exports = encodeNumberAsJSNumber;
