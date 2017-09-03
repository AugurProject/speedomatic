/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var chunk = require("../src/chunk");

describe("chunk", function () {
  var test = function (t) {
    it(t.totalLength + " -> " + t.expected, function () {
      assert.strictEqual(chunk(t.totalLength, t.chunkLength), t.expected);
    });
  };
  test({ totalLength: 0, expected: 0 });
  test({ totalLength: 1, expected: 1 });
  test({ totalLength: 32, expected: 1 });
  test({ totalLength: 63, expected: 1 });
  test({ totalLength: 64, expected: 1 });
  test({ totalLength: 65, expected: 2 });
  test({ totalLength: 127, expected: 2 });
  test({ totalLength: 128, expected: 2 });
  test({ totalLength: 160, expected: 3 });
  test({ totalLength: 255, expected: 4 });
  test({ totalLength: 256, expected: 4 });
  test({ totalLength: 0, chunkLength: 64, expected: 0 });
  test({ totalLength: 1, chunkLength: 64, expected: 1 });
  test({ totalLength: 32, chunkLength: 64, expected: 1 });
  test({ totalLength: 63, chunkLength: 64, expected: 1 });
  test({ totalLength: 64, chunkLength: 64, expected: 1 });
  test({ totalLength: 65, chunkLength: 64, expected: 2 });
  test({ totalLength: 127, chunkLength: 64, expected: 2 });
  test({ totalLength: 128, chunkLength: 64, expected: 2 });
  test({ totalLength: 160, chunkLength: 64, expected: 3 });
  test({ totalLength: 255, chunkLength: 64, expected: 4 });
  test({ totalLength: 256, chunkLength: 64, expected: 4 });
  test({ totalLength: 0, chunkLength: 32, expected: 0 });
  test({ totalLength: 1, chunkLength: 32, expected: 1 });
  test({ totalLength: 32, chunkLength: 32, expected: 1 });
  test({ totalLength: 63, chunkLength: 32, expected: 2 });
  test({ totalLength: 64, chunkLength: 32, expected: 2 });
  test({ totalLength: 65, chunkLength: 32, expected: 3 });
  test({ totalLength: 127, chunkLength: 32, expected: 4 });
  test({ totalLength: 128, chunkLength: 32, expected: 4 });
  test({ totalLength: 160, chunkLength: 32, expected: 5 });
  test({ totalLength: 255, chunkLength: 32, expected: 8 });
  test({ totalLength: 256, chunkLength: 32, expected: 8 });
});
