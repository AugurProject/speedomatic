"use strict";

var hex = require("./hex");
var unfix = require("./unfix");

function unfixSigned(n, encoding) {
  return unfix(hex(n, true), encoding);
}

module.exports = unfixSigned;
