"use strict";

var BigNumber = require("bignumber.js");
var strip0xPrefix = require("./strip-0x-prefix");

function byteArrayToUtf8String(byteArray) {
  var el, byteString;
  if (Buffer.isBuffer(byteArray)) {
    return Buffer.from(byteArray, "hex").toString("utf8");
  }
  if (Array.isArray(byteArray)) {
    byteString = "";
    for (var i = 0, numBytes = byteArray.length; i < numBytes; ++i) {
      el = byteArray[i];
      if (el !== undefined && el !== null) {
        if (el.constructor === String) {
          el = strip0xPrefix(el);
          if (el.length % 2 !== 0) el = "0" + el;
          byteString += el;
        } else if (el.constructor === Number || BigNumber.isBigNumber(el)) {
          el = el.toString(16);
          if (el.length % 2 !== 0) el = "0" + el;
          byteString += el;
        } else if (Buffer.isBuffer(el)) {
          byteString += el.toString("hex");
        }
      }
    }
  }
  if (byteArray.constructor === String) {
    byteString = strip0xPrefix(byteArray);
  } else if (byteArray.constructor === Number || BigNumber.isBigNumber(byteArray)) {
    byteString = byteArray.toString(16);
  }
  try {
    byteString = Buffer.from(byteString, "hex");
  } catch (ex) {
    console.error("[speedomatic] byteArrayToUtf8String:", JSON.stringify(byteString, null, 2));
    throw ex;
  }
  return byteString.toString("utf8");
}

module.exports = byteArrayToUtf8String;
