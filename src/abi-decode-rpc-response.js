"use strict";

var abiDecodeData = require("./abi-decode-data");

function abiDecodeRpcResponse(responseType, abiEncodedRpcResponse) {
  return abiDecodeData([{type: responseType}], abiEncodedRpcResponse)[0];
}

module.exports = abiDecodeRpcResponse;
