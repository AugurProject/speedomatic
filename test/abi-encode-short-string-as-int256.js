/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var abiEncodeShortStringAsInt256 = require("../src/abi-encode-short-string-as-int256");

describe("int256-short string conversions", function () {
  var test = function (t) {
    it(t.encodedAsInt256 + " <-> " + t.shortString, function () {
      assert.strictEqual(t.encodedAsInt256, abiEncodeShortStringAsInt256(t.shortString));
    });
  };
  test({
    shortString: "george",
    encodedAsInt256: "0x67656f7267650000000000000000000000000000000000000000000000000000"
  });
  test({
    shortString: "U.S. Presidential Election",
    encodedAsInt256: "0x552e532e20507265736964656e7469616c20456c656374696f6e000000000000"
  });
  test({
    shortString: "1010101",
    encodedAsInt256: "0x3130313031303100000000000000000000000000000000000000000000000000"
  });
  test({
    shortString: "i'm a",
    encodedAsInt256: "0x69276d2061000000000000000000000000000000000000000000000000000000"
  });
});
