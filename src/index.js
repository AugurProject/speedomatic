"use strict";

var BigNumber = require("bignumber.js");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID, ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN});

module.exports = {
  version: "2.0.3",
  constants: require("./constants"),
  unrollArray: require("./unroll-array"),
  byteArrayToUtf8String: require("./byte-array-to-utf8-string"),
  byteArrayToHexString: require("./byte-array-to-hex-string"),
  abiEncodeShortStringAsInt256: require("./abi-encode-short-string-as-int256"),
  abiDecodeShortStringAsInt256: require("./abi-decode-short-string-as-int256"),
  abiEncodeBytes: require("./abi-encode-bytes"),
  abiDecodeBytes: require("./abi-decode-bytes"),
  unfork: require("./unfork"),
  hex: require("./hex"),
  isHex: require("./is-hex"),
  formatInt256: require("./format-int256"),
  formatEthereumAddress: require("./format-ethereum-address"),
  strip0xPrefix: require("./strip-0x-prefix"),
  prefixHex: require("./prefix-hex"),
  bignum: require("./bignum"),
  fix: require("./fix"),
  unfix: require("./unfix"),
  unfixSigned: require("./unfix-signed"),
  encodeNumberAsBase10String: require("./encode-number-as-base10-string"),
  encodeNumberAsJSNumber: require("./encode-number-as-js-number"),
  padRight: require("./pad-right"),
  padLeft: require("./pad-left"),
  abiEncodeInt256: require("./abi-encode-int256"),
  abiEncodeTransactionPayload: require("./abi-encode-transaction-payload"),
  abiDecodeData: require("./abi-decode-data"),
  abiDecodeRpcResponse: require("./abi-decode-rpc-response"),
  formatAbiRawDecodedDataArray: require("./format-abi-raw-decoded-data-array"),
  formatAbiRawDecodedData: require("./format-abi-raw-decoded-data"),
  serialize: require("./serialize")
};
