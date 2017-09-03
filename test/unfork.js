/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var hex = require("../src/hex");
var unfork = require("../src/unfork");

describe("unfork", function () {
  var test = function (t) {
    it("convert " + t.forked + " to " + t.unforked, function () {
      var unforked = unfork(t.forked, true);
      if (unforked.constructor === BigNumber) {
        unforked = hex(unforked);
      }
      assert.strictEqual(unforked, t.unforked);
    });
  };
  test({
    forked: "-0xeb05bd7c87137434b0dab4b058d1c4f07059415f4c3476b14e6fffdc9e9b103",
    unforked: "0xf14fa428378ec8bcb4f254b4fa72e3b0f8fa6bea0b3cb894eb19000236164efd"
  });
  test({
    forked: new BigNumber("-eb05bd7c87137434b0dab4b058d1c4f07059415f4c3476b14e6fffdc9e9b103", 16),
    unforked: "0xf14fa428378ec8bcb4f254b4fa72e3b0f8fa6bea0b3cb894eb19000236164efd"
  });
  test({
    forked: "0xf14fa428378ec8bcb4f254b4fa72e3b0f8fa6bea0b3cb894eb19000236164efd",
    unforked: "0xf14fa428378ec8bcb4f254b4fa72e3b0f8fa6bea0b3cb894eb19000236164efd"
  });
  test({
    forked: "0x07f75ade249292c9a8f0214f406e055e1f4c8d850090ab8638856ead8a1a920a",
    unforked: "0x07f75ade249292c9a8f0214f406e055e1f4c8d850090ab8638856ead8a1a920a"
  });
  test({
    forked: "0xeac61bc93ac400f2749e2a318d0b6cc66b77b6d616c9d9c7c4b785ea623c961b",
    unforked: "0xeac61bc93ac400f2749e2a318d0b6cc66b77b6d616c9d9c7c4b785ea623c961b"
  });
});
