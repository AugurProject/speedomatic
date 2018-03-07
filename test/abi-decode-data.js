/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var rawEncode = require("ethereumjs-abi").rawEncode;
var abiDecodeData = require("../src/abi-decode-data");

var jsonToEncode = JSON.stringify({
  marketType: "categorical",
  shortDescription: "Will this market be the \u2603 Market?",
  longDescription: "\u2603 Market to rule them all.  \u306a\u305c\u305d\u3093\u306a\u306b\u771f\u5263\u306a\u3093\u3060\uff1f",
  outcomeNames: ["Yes", "No", "Consult \u2603"],
  tags: ["\u2603", "Flaming eyes"],
  creationTimestamp: 1234567890
});

var arrayToEncode = [
  "0x0000000000000000000000000000000000000000000000000000000000000003",
  "0x0000000000000000000000000000000000000000000000000000000000000001",
  "0x0000000000000000000000000000000000000000000000000000000000000002"
];

describe("abiDecodeData", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(abiDecodeData(t.params.inputs, t.params.abiEncodedData));
    });
  };
  test({
    description: "(uint256,string,int256[],bytes32,address,bytes,bytes32[])",
    params: {
      inputs: [{
        name: "indexed-address-param",
        type: "address",
        indexed: true
      }, {
        name: "uint256-param",
        type: "uint256",
        indexed: false
      }, {
        name: "string-param",
        type: "string",
        indexed: false
      }, {
        name: "int256[]-param",
        type: "int256[]",
        indexed: false
      }, {
        name: "bytes32-param",
        type: "bytes32",
        indexed: false
      }, {
        name: "address-param",
        type: "address",
        indexed: false
      }, {
        name: "bytes-param",
        type: "bytes",
        indexed: false
      }, {
        name: "bytes32[]-param",
        type: "bytes32[]",
        indexed: false
      }, {
        name: "address[]-param",
        type: "address[]",
        indexed: false
      }],
      abiEncodedData: "0x" + rawEncode(["uint256", "string", "int256[]", "bytes32", "address", "bytes", "bytes32[]", "address[]"], [
        "0x00000000000000000000000000000000000000000000005150ae84a8cdf00000",
        jsonToEncode,
        arrayToEncode,
        "0x1000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000b0b",
        jsonToEncode,
        arrayToEncode,
        arrayToEncode
      ]).toString("hex")
    },
    assertions: function (decodedData) {
      assert.deepEqual(decodedData, [
        "1500000000000000000000",
        jsonToEncode,
        ["3", "1", "2"],
        "0x1000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000b0b",
        "0x7b226d61726b657454797065223a2263617465676f726963616c222c2273686f72744465736372697074696f6e223a2257696c6c2074686973206d61726b65742062652074686520e29883204d61726b65743f222c226c6f6e674465736372697074696f6e223a22e29883204d61726b657420746f2072756c65207468656d20616c6c2e2020e381aae3819ce3819de38293e381aae381abe79c9fe589a3e381aae38293e381a0efbc9f222c226f7574636f6d654e616d6573223a5b22596573222c224e6f222c22436f6e73756c7420e29883225d2c2274616773223a5b22e29883222c22466c616d696e672065796573225d2c226372656174696f6e54696d657374616d70223a313233343536373839307d",
        [
          "0x0000000000000000000000000000000000000000000000000000000000000003",
          "0x0000000000000000000000000000000000000000000000000000000000000001",
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ],
        [
          "0x0000000000000000000000000000000000000003",
          "0x0000000000000000000000000000000000000001",
          "0x0000000000000000000000000000000000000002"
        ]
      ]);
    }
  });
});
