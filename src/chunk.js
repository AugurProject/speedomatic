"use strict";

function chunk(totalLength, chunkLength) {
  chunkLength = chunkLength || 64;
  return Math.ceil(totalLength / chunkLength);
}

module.exports = chunk;
