/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var abiDecodeBytes = require("../src/abi-decode-bytes");

describe("abiDecodeBytes", function () {
  var test = function (t) {
    it(t.abiEncodedBytes, function () {
      t.assertions(abiDecodeBytes(t.abiEncodedBytes));
    });
  };
  test({
    abiEncodedBytes: "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c207761726d696e672077696c6c2062652067656f656e67696e656572696e672028646566696e65642061732061206d616a6f72697479206f662072657365617263682070617065727320636c61696d696e672074686973206973207768792074656d70732064726f7070656429",
    assertions: function (decodedBytes) {
      assert.strictEqual(decodedBytes, "The ultimate solution to global warming will be geoengineering (defined as a majority of research papers claiming this is why temps dropped)");
    }
  });
  test({
    abiEncodedBytes: "57696c6c20616e20414920626561742074686520547572696e67207465737420627920323032303f",
    assertions: function (decodedBytes) {
      assert.strictEqual(decodedBytes, "Will an AI beat the Turing test by 2020?");
    }
  });
  test({
    abiEncodedBytes: "54686520555320436f6e67726573732077696c6c2070617373207468652046726565646f6d20416374",
    assertions: function (decodedBytes) {
      assert.strictEqual(decodedBytes, "The US Congress will pass the Freedom Act");
    }
  });
  test({
    abiEncodedBytes: "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c207761726d696e672077696c6c206265206120646563726561736520696e20656d697373696f6e732028646566696e65642061732061206d616a6f72697479206f662072657365617263682070617065727320636c61696d696e672074686973206973207768792074656d70732064726f7070656429",
    assertions: function (decodedBytes) {
      assert.strictEqual(decodedBytes, "The ultimate solution to global warming will be a decrease in emissions (defined as a majority of research papers claiming this is why temps dropped)");
    }
  });
  test({
    abiEncodedBytes: "4170706c652077696c6c2072656c65617365206120636172206265666f72652032303138",
    assertions: function (decodedBytes) {
      assert.strictEqual(decodedBytes, "Apple will release a car before 2018");
    }
  });
  test({
    abiEncodedBytes: "5375622024313030303020736d616c6c20636f6e7461696e6564206e75636c6561722066697373696f6e2072656163746f72732077696c6c2065786973742062792032303330",
    assertions: function (decodedBytes) {
      assert.strictEqual(decodedBytes, "Sub $10000 small contained nuclear fission reactors will exist by 2030");
    }
  });
  test({
    abiEncodedBytes: "436f6c6420667573696f6e2077696c6c206265206163686965766564206265666f72652032303230",
    assertions: function (decodedBytes) {
      assert.strictEqual(decodedBytes, "Cold fusion will be achieved before 2020");
    }
  });
  test({
    abiEncodedBytes: "57696c6c206c617773206265207061737365642062616e6e696e6720656e6420746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e69636174696f6e7320696e2074686520554b20647572696e672032303136203f",
    assertions: function (decodedBytes) {
      assert.strictEqual(decodedBytes, "Will laws be passed banning end to end encrypted personal communications in the UK during 2016 ?");
    }
  });
  test({
    abiEncodedBytes: "e381aae3819ce3819de38293e381aae381abe79c9fe589a3e381aae38293e381a0efbc9f20e282ace29883",
    assertions: function (decodedBytes) {
      assert.strictEqual(decodedBytes, "\u306a\u305c\u305d\u3093\u306a\u306b\u771f\u5263\u306a\u3093\u3060\uff1f \u20ac\u2603"); // なぜそんなに真剣なんだ？ €☃
    }
  });
});
