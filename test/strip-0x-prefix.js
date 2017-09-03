/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var strip0xPrefix = require("../src/strip-0x-prefix");

describe("strip0xPrefix: remove leading 0x from a hex string", function () {
  var test = function (t) {
    it("convert " + t.input + " -> " + t.expected, function () {
      assert.strictEqual(strip0xPrefix(t.input), t.expected);
    });
  };
  test({
    input: "0x01",
    expected: "01"
  });
  test({
    input: "0x0",
    expected: "0"
  });
  test({
    input: "0x00",
    expected: "00"
  });
  test({
    input: "0x0x",
    expected: "0x0x"
  });
  test({
    input: "-0x01",
    expected: "-01"
  });
  test({
    input: "-0x0",
    expected: "0"
  });
  test({
    input: "0xf06d69cdc7da0faffb1008270bca38f5",
    expected: "f06d69cdc7da0faffb1008270bca38f5"
  });
  test({
    input: "0x83dbcc02d8ccb40e466191a123791e0e",
    expected: "83dbcc02d8ccb40e466191a123791e0e"
  });
  test({
    input: "-0x83dbcc02d8ccb40e466191a123791e0e",
    expected: "-83dbcc02d8ccb40e466191a123791e0e"
  });
  test({
    input: "0xd172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
    expected: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c"
  });
  test({
    input: "0xab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19",
    expected: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19"
  });
  test({
    input: "f06d69cdc7da0faffb1008270bca38f5",
    expected: "f06d69cdc7da0faffb1008270bca38f5"
  });
  test({
    input: "83dbcc02d8ccb40e466191a123791e0e",
    expected: "83dbcc02d8ccb40e466191a123791e0e"
  });
  test({
    input: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
    expected: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c"
  });
  test({
    input: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19",
    expected: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19"
  });
  test({
    input: "hello world",
    expected: "hello world"
  });
  test({
    input: "",
    expected: ""
  });
  test({
    input: "0x",
    expected: "0x"
  });
  test({
    input: "-0x",
    expected: "-0x"
  });
});
