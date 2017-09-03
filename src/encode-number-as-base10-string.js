"use strict";

var bignum = require("./bignum");

function encodeNumberAsBase10String(n, isWrapped) {
  return bignum(n, "string", isWrapped);
}

module.exports = encodeNumberAsBase10String;
