"use strict";

var rawDecode = require("ethereumjs-abi").rawDecode;
var formatAbiRawDecodedDataArray = require("./format-abi-raw-decoded-data-array");
var strip0xPrefix = require("./strip-0x-prefix");

function abiDecodeData(inputs, abiEncodedData) {
  var dataInputTypes = inputs.filter(function (input) {
    return !input.indexed;
  }).map(function (input) {
    return input.type;
  });
  var abiRawDecodedDataArray = rawDecode(dataInputTypes, Buffer.from(strip0xPrefix(abiEncodedData), "hex"));
  return formatAbiRawDecodedDataArray(dataInputTypes, abiRawDecodedDataArray);
}

module.exports = abiDecodeData;
