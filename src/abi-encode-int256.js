"use strict";

var BigNumber = require("bignumber.js");
var abiEncodeBytes = require("./abi-encode-bytes");

function abiEncodeInt256(value) {
  var cs = [];
  var x = new BigNumber(value, 10);
  while (x.gt(new BigNumber(0))) {
    cs.push(String.fromCharCode(x.mod(new BigNumber(256, 10))));
    x = x.dividedBy(new BigNumber(256, 10)).floor();
  }
  var output = abiEncodeBytes((cs.reverse()).join(""));
  while (output.length < 64) {
    output = "0" + output;
  }
  return output;
}

module.exports = abiEncodeInt256;
