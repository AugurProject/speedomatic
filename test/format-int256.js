/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var formatInt256 = require("../src/format-int256");

describe("formatInt256", function () {
  var test = function (t) {
    it(t.input + " -> " + t.expected, function () {
      var formatted = formatInt256(t.input);
      if (Array.isArray(t.input)) {
        assert.deepEqual(formatted, t.expected);
      } else {
        assert.strictEqual(formatted, t.expected);
      }
    });
  };
  test({
    input: "0x1",
    expected: "0x0000000000000000000000000000000000000000000000000000000000000001"
  });
  test({
    input: "0xec77eede1b373cae5f1c7f2c5167669fbf94f5c5b517b0f187256894264275d8",
    expected: "0xec77eede1b373cae5f1c7f2c5167669fbf94f5c5b517b0f187256894264275d8"
  });
  test({
    input: "0x1111111111111111111111111111111111111111111111111111111111111111",
    expected: "0x1111111111111111111111111111111111111111111111111111111111111111"
  });
  test({
    input: "0x11111111111111111111111111111111111111111111111111111111111111111",
    expected: "0x1111111111111111111111111111111111111111111111111111111111111111"
  });
  test({
    input: "0x11111111111111111111111111111111111111111111111111111111111111112",
    expected: "0x1111111111111111111111111111111111111111111111111111111111111111"
  });
  test({
    input: "oh hi",
    expected: "0x00000000000000000000000000000000000000000000000000000000000oh hi"
  });
  test({
    input: "0x",
    expected: "0x"
  });
  test({
    input: null,
    expected: null
  });
  test({
    input: undefined,
    expected: undefined
  });
  test({
    input: "",
    expected: "0x0000000000000000000000000000000000000000000000000000000000000000"
  });
  test({
    input: "0x0",
    expected: "0x0000000000000000000000000000000000000000000000000000000000000000"
  });
  test({
    input: "-1234",
    expected: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb2e"
  });
  test({
    input: "-0x1234",
    expected: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedcc"
  });
  test({
    input: ["0x1"],
    expected: ["0x0000000000000000000000000000000000000000000000000000000000000001"]
  });
  test({
    input: ["-0x1234", "0x1"],
    expected: [
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedcc",
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    ]
  });
});
