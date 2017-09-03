/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var abiEncodeBytes = require("../src/abi-encode-bytes");

describe("abiEncodeBytes", function () {
  var tests = [
    { value: "The ultimate solution to global warming will be geoengineering (defined as a majority of research papers claiming this is why temps dropped)",
      expected: "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c207761726d696e672077696c6c2062652067656f656e67696e656572696e672028646566696e65642061732061206d616a6f72697479206f662072657365617263682070617065727320636c61696d696e672074686973206973207768792074656d70732064726f7070656429" },
    { value: "Will an AI beat the Turing test by 2020?",
      expected: "57696c6c20616e20414920626561742074686520547572696e67207465737420627920323032303f" },
    { value: "The US Congress will pass the Freedom Act",
      expected: "54686520555320436f6e67726573732077696c6c2070617373207468652046726565646f6d20416374" },
    { value: "The ultimate solution to global warming will be a decrease in emissions (defined as a majority of research papers claiming this is why temps dropped)",
      expected: "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c207761726d696e672077696c6c206265206120646563726561736520696e20656d697373696f6e732028646566696e65642061732061206d616a6f72697479206f662072657365617263682070617065727320636c61696d696e672074686973206973207768792074656d70732064726f7070656429" },
    { value: "Apple will release a car before 2018",
      expected: "4170706c652077696c6c2072656c65617365206120636172206265666f72652032303138" },
    { value: "Sub $10000 small contained nuclear fission reactors will exist by 2030",
      expected: "5375622024313030303020736d616c6c20636f6e7461696e6564206e75636c6561722066697373696f6e2072656163746f72732077696c6c2065786973742062792032303330" },
    { value: "Cold fusion will be achieved before 2020",
      expected: "436f6c6420667573696f6e2077696c6c206265206163686965766564206265666f72652032303230" },
    { value: "Will laws be passed banning end to end encrypted personal communications in the UK during 2016 ?",
      expected: "57696c6c206c617773206265207061737365642062616e6e696e6720656e6420746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e69636174696f6e7320696e2074686520554b20647572696e672032303136203f" },
    { value: [1, 2, 3, {test: "data"}], expected: "5b312c322c332c7b2274657374223a2264617461227d5d"},
    { value: {test: "test"}, expected: "7b2274657374223a2274657374227d"}
  ];
  tests.forEach(function (test) {
    it("should turn " + test.value + " to " + test.expected, function () {
      assert.strictEqual(abiEncodeBytes(test.value), test.expected);
    });
  });
});
