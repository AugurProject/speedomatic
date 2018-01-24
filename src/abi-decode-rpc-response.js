"use strict";

var abiDecodeData = require("./abi-decode-data");
var formatInt256 = require("./format-int256");

function abiDecodeRpcResponse(responseType, abiEncodedRpcResponse) {
  var decodedRpcResponse = abiDecodeData([{type: responseType}], abiEncodedRpcResponse)[0];
  if (responseType === "bool") {
    if (decodedRpcResponse === "true") return true;
    return false;
  } else if (responseType.slice(0, 7) === "bytes32") {
    return formatInt256(decodedRpcResponse);
  }
  return decodedRpcResponse;
}

module.exports = abiDecodeRpcResponse;
