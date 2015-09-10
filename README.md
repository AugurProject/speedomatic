augur-abi
=========

[![Build Status](https://travis-ci.org/AugurProject/augur-abi.svg)](https://travis-ci.org/AugurProject/augur-abi)
[![Coverage Status](https://coveralls.io/repos/AugurProject/augur-abi/badge.svg?branch=master&service=github)](https://coveralls.io/github/AugurProject/augur-abi?branch=master)
[![npm version](https://badge.fury.io/js/augur-abi.svg)](http://badge.fury.io/js/augur-abi)

augur-abi is a standalone JavaScript module that provides Ethereum contract ABI data serialization methods.  [ABI encoding](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI) is needed to invoke functions on Ethereum smart contracts.

This module presently supports only Serpent contracts; it's my intention to add Solidity data type support when I have time!

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
The `encode` method encodes the full ABI data (prefix + parameters) needed for a contract function call.  For example, to encode a method named `double` that takes a single integer parameter with a value of 3:
```javascript
var encoded = augur_abi.encode({
    method: "double",
    signature: "i",
    params: [3]
});
// encoded:
'0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000003'
```
`encoded` is the concatenation of the method's prefix `0x6ffa1caa`, which is derived from the name of the method `"double"` and its signature `"i"`, and the encoded parameter value, `[3]`.

"Signature" refers to the short-form Serpent parameter signature, which allows `i` (int256), `a` (variable-sized int256 array) and `s` (variable-length string/bytes).  For example, a method which takes parameter types int256, string, int256, int256, int256, array would have signature `isiiia`.

Tests
-----

Unit tests are in the `test` directory, and can be run with mocha:

    $ npm test
