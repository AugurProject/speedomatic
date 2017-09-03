"use strict";

var removeTrailingZeros = require("./remove-trailing-zeros");

function abiDecodeBytes(h, strip) {
  var hex = h.toString();
  var str = "";
  if (hex.slice(0, 2) === "0x") hex = hex.slice(2);
  // first 32 bytes = offset
  // second 32 bytes = string length
  if (strip) {
    hex = hex.slice(128);
    hex = removeTrailingZeros(hex);
  }
  for (var i = 0, l = hex.length; i < l; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

module.exports = abiDecodeBytes;
