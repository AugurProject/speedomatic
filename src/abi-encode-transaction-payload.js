"use strict";

var ethereumjsAbi = require("ethereumjs-abi");
var prefixHex = require("./prefix-hex");

// ABI-encode the 'data' field in a transaction payload
function abiEncodeTransactionPayload(payload) {
  payload.signature = payload.signature || [];
  return prefixHex(Buffer.concat([
    ethereumjsAbi.methodID(payload.name, payload.signature),
    ethereumjsAbi.rawEncode(payload.signature, payload.params)
  ]).toString("hex"));
}

module.exports = abiEncodeTransactionPayload;
