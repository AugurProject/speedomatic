"use strict";

var ethereumjsAbi = require("ethereumjs-abi");
var abiEncodeData = require("./abi-encode-data");
var prefixHex = require("./prefix-hex");

// ABI-encode the 'data' field in a transaction payload, with method ID prefix
function abiEncodeTransactionPayload(payload) {
  payload.signature = payload.signature || [];
  return prefixHex(Buffer.concat([ethereumjsAbi.methodID(payload.name, payload.signature), abiEncodeData(payload)]).toString("hex"));
}

module.exports = abiEncodeTransactionPayload;
