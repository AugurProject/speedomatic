/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var bignum = require("../src/bignum");

var exDecimal = 0.123456789;
var exDecimalString = "0.123456789";

describe("bignum", function () {
  it("should be the same if called with a float or a string", function () {
    assert(bignum(exDecimal).eq(bignum(exDecimalString)));
  });
  it("should create 0 successfully", function () {
    assert(bignum(0).eq(new BigNumber(0)));
  });
});
