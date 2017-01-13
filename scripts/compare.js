#!/usr/bin/env node

var assert = console.assert;
var BigNumber = require("bignumber.js");
var augur_abi = require("augur-abi");
var abi = new (require("ethereumjs-abi"))();

var ZERO = new BigNumber(0);
var HUGE = new BigNumber(2).toPower(256);

function isHexString(str) {
  return str.constructor === String &&
        (str.slice(0,2) === "0x" || str.slice(0,3) === "-0x");
}

function parseHex(param) {
  param = new BigNumber(param.replace("0x", ""), 16);
  if (param.lt(ZERO)) param = param.add(HUGE);
  param = param.toString(16);
  if (param.length % 2) param = "0" + param;
  return new Buffer(param, "hex");
}

function parseUglyHex(params, signature) {
  if (params.constructor !== Array) params = [params];
    // for (var i = 0; i < params.length; ++i) {
    //   if (signature[i] === "a") {
    //     for (var j = 0; j < params[i].length; ++j) {
    //       if (isHexString(params[i][j])) {
    //         params[i][j] = parseHex(params[i][j]);
    //       }
    //     }
    //   } else if (signature[i] === "i" && isHexString(params[i])) {
    //     params[i] = parseHex(params[i]);
    //   }
    // }
  return params;
}

function compare(opts) {
  var augur_encoded = augur_abi.encode(opts);
  if (opts.params) opts.params = parseUglyHex(opts.params, opts.signature);
  var ethereumjs_encoded = abi.rawEncode(opts.method, abi.fromSerpent(opts.signature), opts.params);
  console.log("augur-abi:     ", augur_encoded);
  console.log("ethereumjs-abi:", "0x" + ethereumjs_encoded.toString("hex"));
  assert(augur_encoded === "0x" + ethereumjs_encoded.toString("hex"));
}

// int256
compare({
  method: "lololol",
  signature: "i",
  params: 1010101
});
// compare({
//   method: "lololol",
//   signature: "i",
//   params: "1010101"
// });
// compare({
//   method: "lololol",
//   signature: "i",
//   params: "0xf69b5"
// });
// compare({
//   method: "lololol",
//   signature: "i",
//   params: "0x6fc820f34c3bc08c0072da61b8dcfd4d9bd78f4fc5de7eb351ac81d1146a5fe8"
// });
// compare({
//   method: "lololol",
//   signature: "i",
//   params: "-0x4af42be82cbfe625ff3a0efe7ac088e10683d3d034c6e5c7fdbaa603b267faae"
// })
// compare({
//   method: "lololol",
//   signature: "iii",
//   params: [1010101, "0x0f69b5", "0x6fc820f34c3bc08c0072da61b8dcfd4d9bd78f4fc5de7eb351ac81d1146a5fe8"]
// });

// bytes
compare({
  method: "lololol",
  signature: "s",
  params: "1010101"
});
compare({
  method: "lololol",
  signature: "s",
  params: "0x0f69b5"
});
compare({
  method: "lololol",
  signature: "s",
  params: "hello world!"
});
compare({
  method: "lololol",
  signature: "s",
  params: "hello world hello world hello world hello world hello world hello world hello world"
});

// int256[]
// compare({
//   method: "lololol",
//   signature: "a",
//   params: [[1, 2, 3, 4, 5]]
// });
// compare({
//   method: "lololol",
//   signature: "a",
//   params: [["0x0f69b5", "-0x4af42be82cbfe625ff3a0efe7ac088e10683d3d034c6e5c7fdbaa603b267faae"]]
// });
