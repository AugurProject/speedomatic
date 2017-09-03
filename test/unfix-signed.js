/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var unfixSigned = require("../src/unfix-signed");

describe("unfixSigned", function () {
  it("fixed-point -> hex", function () {
    assert.strictEqual(unfixSigned("0xfffffffffffffffffffffffffffffffffffffffffffffffff21f494c589c0000", "hex"), "-0x1");
  });
  it("fixed-point -> string", function () {
    assert.strictEqual(unfixSigned("0xfffffffffffffffffffffffffffffffffffffffffffffffff21f494c589c0000", "string"), "-1");
  });
  it("fixed-point -> number", function () {
    assert.strictEqual(unfixSigned("0xfffffffffffffffffffffffffffffffffffffffffffffffff21f494c589c0000", "number"), -1);
  });
});
