"use strict";

var rawEncode = require("ethereumjs-abi").rawEncode;
var removeTrailingZeros = require("./remove-trailing-zeros");

// convert bytes to ABI format
function abiEncodeBytes(bytesToEncode, toArray, isPadded) {
  var abiEncodedBytes = rawEncode(["bytes"], [bytesToEncode]).toString("hex");
  if (isPadded) return abiEncodedBytes;
  return removeTrailingZeros(abiEncodedBytes).slice(128);
}

module.exports = abiEncodeBytes;
