"use strict";

var prefixHex = require("./prefix-hex");

// convert bytes to ABI format
function abiEncodeBytes(str, toArray) {
  var hexbyte, hex, i, len;
  if (str && str.constructor === Object || Array.isArray(str)) {
    str = JSON.stringify(str);
  }
  len = str.length;
  if (toArray) {
    hex = [];
    for (i = 0; i < len; ++i) {
      hexbyte = str.charCodeAt(i).toString(16);
      if (hexbyte.length === 1) hexbyte = "0" + hexbyte;
      hex.push(prefixHex(hexbyte));
    }
  } else {
    hex = "";
    for (i = 0; i < len; ++i) {
      hexbyte = str.charCodeAt(i).toString(16);
      if (hexbyte.length === 1) hexbyte = "0" + hexbyte;
      hex += hexbyte;
    }
  }
  return hex;
}

module.exports = abiEncodeBytes;
