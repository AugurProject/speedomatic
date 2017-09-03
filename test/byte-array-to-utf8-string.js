/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var byteArrayToUtf8String = require("../src/byte-array-to-utf8-string");

function toArray(buf) {
  var buflen = buf.length;
  var ab = [];
  for (var i = 0; i < buflen; i += 2) {
    ab.push("0x" + buf.slice(i, i + 2).toString(16));
  }
  return ab;
}

describe("byteArrayToUtf8String", function () {
  var test = function (t) {
    it(t.byteArray + " -> " + t.utf8String, function () {
      assert.strictEqual(byteArrayToUtf8String(t.byteArray), t.utf8String);
    });
  };
  test({
    byteArray: ["0xe3", "0x81", "0xaa"],
    utf8String: "\u306a" // な
  });
  test({
    byteArray: ["e3", "81", "aa"],
    utf8String: "\u306a"
  });
  test({
    byteArray: [227, 129, 170],
    utf8String: "\u306a"
  });
  test({
    byteArray: [new BigNumber("0xe3", 16), new BigNumber("0x81", 16), new BigNumber("0xaa", 16)],
    utf8String: "\u306a"
  });
  test({
    byteArray: "e381aa",
    utf8String: "\u306a"
  });
  test({
    byteArray: [Buffer.from("e3", "hex"), Buffer.from("81", "hex"), Buffer.from("aa", "hex")],
    utf8String: "\u306a"
  });
  test({
    byteArray: 14909866,
    utf8String: "\u306a"
  });
  test({
    byteArray: new BigNumber("0xe381aa", 16),
    utf8String: "\u306a"
  });
  test({
    byteArray: "e381aae3819ce3819de38293e381aae381abe79c9fe589a3e381aae38293e381a0efbc9f20e282ace29883",
    utf8String: "\u306a\u305c\u305d\u3093\u306a\u306b\u771f\u5263\u306a\u3093\u3060\uff1f \u20ac\u2603" // なぜそんなに真剣なんだ？ €☃
  });
  test({
    byteArray: Buffer.from("e381aae3819ce3819de38293e381aae381abe79c9fe589a3e381aae38293e381a0efbc9f20e282ace29883", "hex"),
    utf8String: "\u306a\u305c\u305d\u3093\u306a\u306b\u771f\u5263\u306a\u3093\u3060\uff1f \u20ac\u2603"
  });
  test({
    byteArray: toArray("e381aae3819ce3819de38293e381aae381abe79c9fe589a3e381aae38293e381a0efbc9f20e282ace29883"),
    utf8String: "\u306a\u305c\u305d\u3093\u306a\u306b\u771f\u5263\u306a\u3093\u3060\uff1f \u20ac\u2603"
  });
  test({
    byteArray: "527573736961204b484c202d204a6f6b657269742056530944696e616d6f2052696761202d2d2057696c6c2074686520326e6420517561727465722048617665206d6f7265206f72206c657373207468616e20332e3520476f616c733f",
    utf8String: "Russia KHL - Jokerit VS\tDinamo Riga -- Will the 2nd Quarter Have more or less than 3.5 Goals?"
  });
  test({
    byteArray: toArray("527573736961204b484c202d204a6f6b657269742056530944696e616d6f2052696761202d2d2057696c6c2074686520326e6420517561727465722048617665206d6f7265206f72206c657373207468616e20332e3520476f616c733f"),
    utf8String: "Russia KHL - Jokerit VS\tDinamo Riga -- Will the 2nd Quarter Have more or less than 3.5 Goals?"
  });
  test({
    byteArray: [
      "0x52",
      "0x75",
      "0x73",
      "0x73",
      "0x69",
      "0x61",
      "0x20",
      "0x4b",
      "0x48",
      "0x4c",
      "0x20",
      "0x2d",
      "0x20",
      "0x4a",
      "0x6f",
      "0x6b",
      "0x65",
      "0x72",
      "0x69",
      "0x74",
      "0x20",
      "0x56",
      "0x53",
      "0x9",
      "0x44",
      "0x69",
      "0x6e",
      "0x61",
      "0x6d",
      "0x6f",
      "0x20",
      "0x52",
      "0x69",
      "0x67",
      "0x61",
      "0x20",
      "0x2d",
      "0x2d",
      "0x20",
      "0x57",
      "0x69",
      "0x6c",
      "0x6c",
      "0x20",
      "0x74",
      "0x68",
      "0x65",
      "0x20",
      "0x32",
      "0x6e",
      "0x64",
      "0x20",
      "0x51",
      "0x75",
      "0x61",
      "0x72",
      "0x74",
      "0x65",
      "0x72",
      "0x20",
      "0x48",
      "0x61",
      "0x76",
      "0x65",
      "0x20",
      "0x6d",
      "0x6f",
      "0x72",
      "0x65",
      "0x20",
      "0x6f",
      "0x72",
      "0x20",
      "0x6c",
      "0x65",
      "0x73",
      "0x73",
      "0x20",
      "0x74",
      "0x68",
      "0x61",
      "0x6e",
      "0x20",
      "0x33",
      "0x2e",
      "0x35",
      "0x20",
      "0x47",
      "0x6f",
      "0x61",
      "0x6c",
      "0x73",
      "0x3f"
    ],
    utf8String: "Russia KHL - Jokerit VS\tDinamo Riga -- Will the 2nd Quarter Have more or less than 3.5 Goals?"
  });
});
