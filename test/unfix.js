/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var fix = require("../src/fix");
var unfix = require("../src/unfix");

var exInteger = 12345678901;
var exIntegerHex = "0x2dfdc1c35";
var exIntegerString = "12345678901";

describe("unfix", function () {
  it("fixed-point -> hex", function () {
    assert.strictEqual(unfix(fix(exIntegerHex, "BigNumber"), "hex"), exIntegerHex);
    assert.strictEqual(unfix("0x00000000000000000000000000000000000000000000021a72a75ef8d57ef000", "hex"), "0x26cd");
  });
  it("fixed-point -> string", function () {
    assert.strictEqual(unfix(fix(exIntegerString, "BigNumber"), "string"), exIntegerString);
    assert.strictEqual(unfix("0x00000000000000000000000000000000000000000000021a72a75ef8d57ef000", "string"), "9932.60998812");
  });
  it("fixed-point -> number", function () {
    assert.strictEqual(unfix(fix(exIntegerString, "BigNumber"), "number"), exInteger);
    assert.strictEqual(unfix("0x00000000000000000000000000000000000000000000021a72a75ef8d57ef000", "number"), 9932.60998812);
  });
});
