/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var FXP_ONE = require("../src/constants").FXP_ONE;
var fix = require("../src/fix");

var exDecimal = 0.123456789;
var exDecimalString = "0.123456789";

describe("fix", function () {
  it("should be equal to round(n*2^64)", function () {
    assert(fix(exDecimal, "BigNumber").eq((new BigNumber(exDecimal)).mul(FXP_ONE).round()));
  });
  it("should return a base 10 string '123456789000000000'", function () {
    assert.strictEqual(fix(exDecimal, "string"), "123456789000000000");
  });
  it("should return a base 16 string '0x1b69b4ba5749200'", function () {
    assert.strictEqual(fix(exDecimalString, "hex"), "0x1b69b4ba5749200");
  });
  it("should return a base 16 string '0x8a5ca67d92b2910'", function () {
    assert.strictEqual(fix(0.6231266708346084, "hex"), "0x8a5ca67d92b2910");
  });
  it("should return a base 16 string '0x8a5ca67d92b2910'", function () {
    assert.strictEqual(fix("0.6231266708346084", "hex"), "0x8a5ca67d92b2910");
  });
});
