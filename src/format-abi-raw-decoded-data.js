"use strict";

var formatEthereumAddress = require("./format-ethereum-address");
var hex = require("./hex");
var prefixHex = require("./prefix-hex");

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
    return hex(decodedData);
  }
  return decodedData.toString();
}

module.exports = formatAbiRawDecodedData;
