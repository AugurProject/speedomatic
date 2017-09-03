"use strict";

var removeTrailingZeros = require("./remove-trailing-zeros");
var strip0xPrefix = require("./strip-0x-prefix");

function abiDecodeShortStringAsInt256(int256) {
  return Buffer.from(strip0xPrefix(removeTrailingZeros(int256)), "hex").toString("utf8");
}

module.exports = abiDecodeShortStringAsInt256;
