"use strict";

var formatAbiRawDecodedData = require("./format-abi-raw-decoded-data");

function formatAbiRawDecodedDataArray(dataInputTypes, decodedDataArray) {
  return decodedDataArray.map(function (decodedData, i) {
    return formatAbiRawDecodedData(dataInputTypes[i], decodedData);
  });
}

module.exports = formatAbiRawDecodedDataArray;
