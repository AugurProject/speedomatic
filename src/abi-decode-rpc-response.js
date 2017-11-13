"use strict";

var abiDecodeData = require("./abi-decode-data");

function abiDecodeRpcResponse(responseType, abiEncodedRpcResponse) {
  var decodedRpcResponse = abiDecodeData([{type: responseType}], abiEncodedRpcResponse)[0];
  if (responseType === "bool") return Boolean(decodedRpcResponse);
  return decodedRpcResponse;
}

module.exports = abiDecodeRpcResponse;
