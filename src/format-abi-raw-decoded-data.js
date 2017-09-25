"use strict";

var formatEthereumAddress = require("./format-ethereum-address");
var prefixHex = require("./prefix-hex");

function formatAbiRawDecodedData(inputType, decodedData) {
  if (inputType === "null") return null;
  if (inputType.slice(-2) !== "[]") {
    if (inputType.startsWith("address")) {
      return formatEthereumAddress(decodedData.toString("hex"));
    } else if (inputType.startsWith("bytes")) {
      return prefixHex(decodedData.toString("hex"));
    }
    return decodedData.toString();
  }
  return decodedData.map(function (decodedElement) {
    return formatAbiRawDecodedData(inputType.slice(0, -2), decodedElement);
  });
}

module.exports = formatAbiRawDecodedData;
