"use strict";

var strip0xPrefix = require("./strip-0x-prefix");

function byteArrayToHexString(b) {
  var hexbyte, h = "";
  for (var i = 0, n = b.length; i < n; ++i) {
    hexbyte = strip0xPrefix(b[i].toString(16));
    if (hexbyte.length === 1) hexbyte = "0" + hexbyte;
    h += hexbyte;
  }
  return h;
}

module.exports = byteArrayToHexString;
