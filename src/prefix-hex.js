"use strict";

var BigNumber = require("bignumber.js");

function prefixHex(n) {
  if (n === undefined || n === null || n === "") return n;
  if (n.constructor === Number || n.constructor === BigNumber) {
    n = n.toString(16);
  }
  if (n.constructor === String && n.slice(0, 2) !== "0x" && n.slice(0, 3) !== "-0x") {
    if (n.slice(0, 1) === "-") {
      n = "-0x" + n.slice(1);
    } else {
      n = "0x" + n;
    }
  }
  return n;
}

module.exports = prefixHex;
