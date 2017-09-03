/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var isHex = require("../src/is-hex");

describe("isHex: test if input is hex", function () {
  var test = function (t) {
    it("convert " + t.input + " -> " + t.expected, function () {
      assert.strictEqual(isHex(t.input), t.expected);
    });
  };
  test({
    input: "0",
    expected: true
  });
  test({
    input: "01",
    expected: true
  });
  test({
    input: "1010101",
    expected: true
  });
  test({
    input: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
    expected: true
  });
  test({
    input: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde470x",
    expected: false
  });
  test({
    input: "d172bf743a674da9cdadz4534d56926ef8358534d458fffccd4e6ad2fbde479c",
    expected: false
  });
  test({
    input: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19",
    expected: true
  });
  test({
    input: "0123456789abcdef",
    expected: true
  });
  test({
    input: "0123456789abcdefg",
    expected: false
  });
  test({
    input: "hello world",
    expected: false
  });
  test({
    input: "helloworld",
    expected: false
  });
  test({
    input: 1,
    expected: false
  });
  test({
    input: 0x01,
    expected: false
  });
  test({
    input: 123456,
    expected: false
  });
  test({
    input: "",
    expected: false
  });
  test({
    input: "0x01",
    expected: false
  });
  test({
    input: "-0x",
    expected: false
  });
});
