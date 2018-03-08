"use strict";

var formatEthereumAddress = require("./format-ethereum-address");
var hex = require("./hex");
var prefixHex = require("./prefix-hex");
var formatInt256 = require("./format-int256");

function formatAbiRawDecodedData(inputType, decodedData) {
  if (inputType === "null") return null;
  if (inputType.slice(-2) === "[]") {
    return decodedData.map(function (decodedElement) {
      return formatAbiRawDecodedData(inputType.slice(0, -2), decodedElement);
    });
  }
  if (inputType.startsWith("address")) {
    return formatEthereumAddress(decodedData.toString("hex"));
  } else if (inputType === "bytes") {
    return prefixHex(decodedData.toString("hex"));
  } else if (inputType.startsWith("bytes")) {
    return formatInt256(hex(decodedData));
  } else if (inputType.startsWith("bool")) {
    return decodedData;
  }
  return decodedData.toString();
}

module.exports = formatAbiRawDecodedData;
