/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var encodeNumberAsJSNumber = require("../src/encode-number-as-js-number");

describe("encodeNumberAsJSNumber", function () {
  var test = function (t) {
    it(t.input + " -> " + t.expected, function () {
      var actual = encodeNumberAsJSNumber(t.input);
      if (actual && Array.isArray(actual)) {
        assert.deepEqual(actual, t.expected);
      } else {
        assert.strictEqual(actual, t.expected);
      }
    });
  };
  test({
    input: 1,
    expected: 1
  });
  test({
    input: 100,
    expected: 100
  });
  test({
    input: -2,
    expected: -2
  });
  test({
    input: 1010101,
    expected: 1010101
  });
  test({
    input: 3.1415,
    expected: 3.1415
  });
  test({
    input: .3109513,
    expected: 0.3109513
  });
  test({
    input: 0.3109513,
    expected: 0.3109513
  });
  test({
    input: 1.0000000000001,
    expected: 1.0000000000001
  });
  test({
    input: "1",
    expected: 1
  });
  test({
    input: "100",
    expected: 100
  });
  test({
    input: "-2",
    expected: -2
  });
  test({
    input: "1010101",
    expected: 1010101
  });
  test({
    input: "3.1415",
    expected: 3.1415
  });
  test({
    input: ".3109513",
    expected: 0.3109513
  });
  test({
    input: "0.3109513",
    expected: 0.3109513
  });
  test({
    input: "1.0000000000001",
    expected: 1.0000000000001
  });
  test({
    input: "0x1",
    expected: 1
  });
  test({
    input: "0x64",
    expected: 100
  });
  test({
    input: "-0x2",
    expected: -2
  });
  test({
    input: "0xf69b5",
    expected: 1010101
  });
  test({
    input: new BigNumber(1),
    expected: 1
  });
  test({
    input: new BigNumber(100),
    expected: 100
  });
  test({
    input: new BigNumber("-2"),
    expected: -2
  });
  test({
    input: new BigNumber(1010101),
    expected: 1010101
  });
  test({
    input: new BigNumber("3.1415"),
    expected: 3.1415
  });
  test({
    input: new BigNumber(".3109513"),
    expected: 0.3109513
  });
  test({
    input: new BigNumber("0.3109513"),
    expected: 0.3109513
  });
  test({
    input: new BigNumber("1.000000000000000000000000000001"),
    expected: 1.00000000000000000000000000000
  });
  test({
    input: [1, 2, 3],
    expected: [1, 2, 3]
  });
  test({
    input: [1, 2, "3"],
    expected: [1, 2, 3]
  });
  test({
    input: [0],
    expected: [0]
  });
  test({
    input: ["0x1", new BigNumber(2), -2, 0, "1010101"],
    expected: [1, 2, -2, 0, 1010101]
  });
});
