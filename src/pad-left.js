"use strict";

var chunk = require("./chunk");
var prefixHex = require("./prefix-hex");
var strip0xPrefix = require("./strip-0x-prefix");

function padLeft(s, chunkLength, hasPrefix) {
  chunkLength = chunkLength || 64;
  s = strip0xPrefix(s);
  var multiple = chunkLength * (chunk(s.length, chunkLength) || 1);
  while (s.length < multiple) {
    s = "0" + s;
  }
  if (hasPrefix) s = prefixHex(s);
  return s;
}

module.exports = padLeft;
