/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var hex = require("../src/hex");

describe("hex: hexadecimal conversion", function () {
  // from web3.js toHex tests
  var tests = [
    {value: 1, expected: "0x1"},
    {value: "1", expected: "0x1"},
    {value: "0x1", expected: "0x1"},
    {value: "15", expected: "0xf"},
    {value: "0xf", expected: "0xf"},
    {value: -1, expected: "-0x1"},
    {value: "-1", expected: "-0x1"},
    {value: "-0x1", expected: "-0x1"},
    {value: "-15", expected: "-0xf"},
    {value: "-0xf", expected: "-0xf"},
    {value: "0x657468657265756d", expected: "0x657468657265756d"},
    {value: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd", expected: "-0x3"},
    {value: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", expected: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"},
    {value: "0x8000000000000000000000000000000000000000000000000000000000000000", expected: "-0x8000000000000000000000000000000000000000000000000000000000000000"},
    {value: "0x8000000000000000000000000000000000000000000000000000000000000001", expected: "-0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"},
    {value: "-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", expected: "0x1"},
    {value: "-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd", expected: "0x3"},
    {value: "-0x8000000000000000000000000000000000000000000000000000000000000000", expected: "-0x8000000000000000000000000000000000000000000000000000000000000000"},
    {value: "-0x8000000000000000000000000000000000000000000000000000000000000001", expected: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"},
    {value: 0, expected: "0x0"},
    {value: "0", expected: "0x0"},
    {value: "0x0", expected: "0x0"},
    {value: -0, expected: "0x0"},
    {value: "-0", expected: "0x0"},
    {value: "-0x0", expected: "0x0"},
    {value: '{"test": "test"}', expected: "0x7b2274657374223a202274657374227d"},
    {value: {test: "test"}, expected: "0x7b2274657374223a2274657374227d"},
    {value: "\ttabbity", expected: "0x0974616262697479"},
    {value: "myString", expected: "0x6d79537472696e67"},
    {value: new BigNumber(15), expected: "0xf"},
    {value: true, expected: "0x1"},
    {value: false, expected: "0x0"},
    {value: [1, 2, 3], expected: ["0x1", "0x2", "0x3"]},
    {value: [1, 2, "3"], expected: ["0x1", "0x2", "0x3"]},
    {value: [0], expected: ["0x0"]},
    {value: ["0x1", new BigNumber(2), -2, 0, "1010101"], expected: ["0x1", "0x2", "-0x2", "0x0", "0xf69b5"]},
    {value: Buffer.from("0f69b5", "hex"), expected: "0x0f69b5"}
  ];
  tests.forEach(function (t) {
    it("should turn " + t.value + " to " + t.expected, function () {
      if (t.expected.constructor === Array) {
        assert.deepEqual(hex(t.value, true), t.expected);
      } else {
        assert.strictEqual(hex(t.value, true), t.expected);
      }
    });
  });
});
