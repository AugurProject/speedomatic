augur-abi
=========

[![Build Status](https://travis-ci.org/AugurProject/augur-abi.svg)](https://travis-ci.org/AugurProject/augur-abi)
[![Coverage Status](https://coveralls.io/repos/AugurProject/augur-abi/badge.svg?branch=master&service=github)](https://coveralls.io/github/AugurProject/augur-abi?branch=master)
[![npm version](https://badge.fury.io/js/augur-abi.svg)](http://badge.fury.io/js/augur-abi)

augur-abi provides Ethereum contract ABI data serialization methods.  [ABI encoding](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI) is needed to invoke functions on Ethereum smart contracts.

Installation
------------

    $ npm install augur-abi

Usage
-----

To use augur-abi in Node.js, just `require` it:
```javascript
var augur_abi = require("augur-abi");
```
A minified, browserified file `dist/augur-abi.min.js` is included for use in the browser.  Including this file simply attaches the `augur_abi` object to `window`:
```html
<script src="dist/augur-abi.min.js" type="text/javascript"></script>
```
The `encode` method encodes the full ABI data (prefix + parameters) needed for a contract function call.  For example, to encode a method named `double` that takes a single 256-bit integer parameter with a value of 3:
```javascript
var encoded = augur_abi.encode({
    name: "double",
    signature: ["int256"],
    params: ["0x3"]
});
// encoded:
"0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000003"
```
`encoded` is the concatenation of the method's prefix `0x6ffa1caa`, which is derived from the name of the method `"double"` and its signature `"[int256]"`, and the encoded parameter value, `["0x3"]`.

Tests
-----

Unit tests are in the `test` directory, and can be run with mocha:

    $ npm test
