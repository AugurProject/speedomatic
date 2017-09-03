"use strict";

var padRight = require("./pad-right");
var prefixHex = require("./prefix-hex");

function abiEncodeShortStringAsInt256(shortString) {
  var encoded = shortString;
  if (encoded.length > 32) encoded = encoded.slice(0, 32);
  return prefixHex(padRight(Buffer.from(encoded, "utf8").toString("hex")));
}

module.exports = abiEncodeShortStringAsInt256;
