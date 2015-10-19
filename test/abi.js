/**
 * Unit tests for augur-abi.
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var abi = require("../");
var coder = require("../lib/solidity/coder");

require('it-each')({ testPerIteration: true });

function chunk32(string, stride, offset) {
    var elements, chunked, position;
    if (string.length >= 66) {
        stride = stride || 64;
        if (offset) {
            elements = Math.ceil(string.slice(offset).length / stride) + 1;
        } else {
            elements = Math.ceil(string.length / stride);
        }
        chunked = new Array(elements);
        position = 0;
        for (var i = 0; i < elements; ++i) {
            if (offset && i === 0) {
                chunked[i] = string.slice(position, position + offset);
                position += offset;
            } else {
                chunked[i] = string.slice(position, position + stride);
                position += stride;
            }
        }
        return chunked;
    } else {
        return string;
    }
}

describe("hex: hexadecimal conversion", function () {

    // from web3.js toHex tests
    var tests = [
        { value: 1, expected: "0x1" },
        { value: "1", expected: "0x1" },
        { value: "0x1", expected: "0x1"},
        { value: "15", expected: "0xf"},
        { value: "0xf", expected: "0xf"},
        { value: -1, expected: "-0x1"},
        { value: "-1", expected: "-0x1"},
        { value: "-0x1", expected: "-0x1"},
        { value: "-15", expected: "-0xf"},
        { value: "-0xf", expected: "-0xf"},
        { value: "0x657468657265756d", expected: "0x657468657265756d"},
        { value: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd",
          expected: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd" },
        { value: "-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          expected: "-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        { value: "-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd",
          expected: "-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd" },
        { value: 0, expected: "0x0"},
        { value: "0", expected: "0x0"},
        { value: "0x0", expected: "0x0"},
        { value: -0, expected: "0x0"},
        { value: "-0", expected: "0x0"},
        { value: "-0x0", expected: "0x0"},
        { value: '{"test": "test"}', expected: "0x7b2274657374223a202274657374227d"},
        { value: {test: "test"}, expected: "0x7b2274657374223a2274657374227d"},
        { value: "\ttabbity", expected: "0x0974616262697479"},
        { value: "myString", expected: "0x6d79537472696e67"},
        { value: new BigNumber(15), expected: "0xf"},
        { value: true, expected: "0x1"},
        { value: false, expected: "0x0"},
        { value: [1, 2, 3], expected: ["0x1", "0x2", "0x3"] },
        { value: [1, 2, "3"], expected: ["0x1", "0x2", "0x3"] },
        { value: [0], expected: ["0x0"] },
        { value: ["0x1", new BigNumber(2), -2, 0, "1010101"],
          expected: ["0x1", "0x2", "-0x2", "0x0", "0xf69b5"] },
        { value: new Buffer("0f69b5", "hex"), expected: "0x0f69b5" }
    ];

    tests.forEach(function (t) {
        it("should turn " + t.value + " to " + t.expected, function () {
            if (t.expected.constructor === Array) {
                assert.deepEqual(abi.hex(t.value, true), t.expected);
            } else {
                assert.strictEqual(abi.hex(t.value, true), t.expected);
            }
        });
    });
});

describe("zero_prefix", function () {

    var test = function (t) {
        it("convert " + t.input + " -> " + t.expected, function () {
            assert.strictEqual(abi.zero_prefix(t.input), t.expected);
        });
    };

    test({
        input: "0x1",
        expected: "0x01"
    });
    test({
        input: "0x101",
        expected: "0x0101"
    });
    test({
        input: "0xf69b5",
        expected: "0x0f69b5"
    });
    test({
        input: "0x01",
        expected: "0x01"
    });
    test({
        input: "0x0101",
        expected: "0x0101"
    });
    test({
        input: "0x0f69b5",
        expected: "0x0f69b5"
    })

});

describe("is_hex: test if input is hex", function () {

    var test = function (t) {
        it("convert " + t.input + " -> " + t.expected, function () {
            assert.strictEqual(abi.is_hex(t.input), t.expected);
        });
    };

    test({
        input: "0",
        expected: true
    });
    test({
        input: "01",
        expected: true
    });
    test({
        input: "1010101",
        expected: true
    });
    test({
        input: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
        expected: true
    });
    test({
        input: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde470x",
        expected: false
    });
    test({
        input: "d172bf743a674da9cdadz4534d56926ef8358534d458fffccd4e6ad2fbde479c",
        expected: false
    });
    test({
        input: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19",
        expected: true
    });
    test({
        input: "0123456789abcdef",
        expected: true
    });
    test({
        input: "0123456789abcdefg",
        expected: false
    });
    test({
        input: "hello world",
        expected: false
    });
    test({
        input: "helloworld",
        expected: false
    });
    test({
        input: 1,
        expected: false
    });
    test({
        input: 0x01,
        expected: false
    });
    test({
        input: 123456,
        expected: false
    });
    test({
        input: "",
        expected: false
    });
    test({
        input: "0x01",
        expected: false
    });
    test({
        input: "-0x",
        expected: false
    });
});

describe("strip_0x: remove leading 0x from a hex string", function () {

    var test = function (t) {
        it("convert " + t.input + " -> " + t.expected, function () {
            assert.strictEqual(abi.strip_0x(t.input), t.expected);
        });
    };

    test({
        input: "0x01",
        expected: "01"
    });
    test({
        input: "0x0",
        expected: "0"
    });
    test({
        input: "0x00",
        expected: "00"
    });
    test({
        input: "0x0x",
        expected: "0x0x"
    });
    test({
        input: "-0x01",
        expected: "-01"
    });
    test({
        input: "-0x0",
        expected: "0"
    });
    test({
        input: "0xf06d69cdc7da0faffb1008270bca38f5",
        expected: "f06d69cdc7da0faffb1008270bca38f5"
    });
    test({
        input: "0x83dbcc02d8ccb40e466191a123791e0e",
        expected: "83dbcc02d8ccb40e466191a123791e0e"
    });
    test({
        input: "-0x83dbcc02d8ccb40e466191a123791e0e",
        expected: "-83dbcc02d8ccb40e466191a123791e0e"
    });
    test({
        input: "0xd172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
        expected: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c"
    });
    test({
        input: "0xab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19",
        expected: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19"
    });
    test({
        input: "f06d69cdc7da0faffb1008270bca38f5",
        expected: "f06d69cdc7da0faffb1008270bca38f5"
    });
    test({
        input: "83dbcc02d8ccb40e466191a123791e0e",
        expected: "83dbcc02d8ccb40e466191a123791e0e"
    });
    test({
        input: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
        expected: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c"
    });
    test({
        input: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19",
        expected: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19"
    });
    test({
        input: "hello world",
        expected: "hello world"
    });
    test({
        input: "",
        expected: ""
    });
    test({
        input: "0x",
        expected: "0x"
    });
    test({
        input: "-0x",
        expected: "-0x"
    });
});

describe("string: numerical string conversion", function () {

    var test = function (t) {
        it(t.input + " -> " + t.expected, function () {
            var actual = abi.string(t.input);
            if (actual && actual.constructor === Array) {
                assert.deepEqual(actual, t.expected)
            } else {
                assert.strictEqual(actual, t.expected);
            }
        });
    };

    test({
        input: 1,
        expected: "1"
    });
    test({
        input: 100,
        expected: "100"
    });
    test({
        input: -2,
        expected: "-2"
    });
    test({
        input: 1010101,
        expected: "1010101"
    });
    test({
        input: 3.1415,
        expected: "3.1415"
    });
    test({
        input: .3109513,
        expected: "0.3109513"
    });
    test({
        input: 0.3109513,
        expected: "0.3109513"
    });
    test({
        input: 1.0000000000001,
        expected: "1.0000000000001"
    });
    test({
        input: "1",
        expected: "1"
    });
    test({
        input: "100",
        expected: "100"
    });
    test({
        input: "-2",
        expected: "-2"
    });
    test({
        input: "1010101",
        expected: "1010101"
    });
    test({
        input: "3.1415",
        expected: "3.1415"
    });
    test({
        input: ".3109513",
        expected: "0.3109513"
    });
    test({
        input: "0.3109513",
        expected: "0.3109513"
    });
    test({
        input: "1.0000000000001",
        expected: "1.0000000000001"
    });
    test({
        input: "0x1",
        expected: "1",
    });
    test({
        input: "0x64",
        expected: "100",
    });
    test({
        input: "-0x2",
        expected: "-2",
    });
    test({
        input: "0xf69b5",
        expected: "1010101",
    });
    test({
        input: new BigNumber(1),
        expected: "1"
    });
    test({
        input: new BigNumber(100),
        expected: "100"
    });
    test({
        input: new BigNumber("-2"),
        expected: "-2"
    });
    test({
        input: new BigNumber(1010101),
        expected: "1010101"
    });
    test({
        input: new BigNumber("3.1415"),
        expected: "3.1415"
    });
    test({
        input: new BigNumber(".3109513"),
        expected: "0.3109513"
    });
    test({
        input: new BigNumber("0.3109513"),
        expected: "0.3109513"
    });
    test({
        input: new BigNumber("1.000000000000000000000000000001"),
        expected: "1.000000000000000000000000000001"
    });
    test({
        input: [1, 2, 3],
        expected: ["1", "2", "3"]
    });
    test({
        input: [1, 2, "3"],
        expected: ["1", "2", "3"]
    });
    test({
        input: [0],
        expected: ["0"]
    });
    test({
        input: ["0x1", new BigNumber(2), -2, 0, "1010101"],
        expected: ["1", "2", "-2", "0", "1010101"]
    });

});

describe("number: number conversion", function () {

    var test = function (t) {
        it(t.input + " -> " + t.expected, function () {
            var actual = abi.number(t.input);
            if (actual && actual.constructor === Array) {
                assert.deepEqual(actual, t.expected)
            } else {
                assert.strictEqual(actual, t.expected);
            }
        });
    };

    test({
        input: 1,
        expected: 1
    });
    test({
        input: 100,
        expected: 100
    });
    test({
        input: -2,
        expected: -2
    });
    test({
        input: 1010101,
        expected: 1010101
    });
    test({
        input: 3.1415,
        expected: 3.1415
    });
    test({
        input: .3109513,
        expected: 0.3109513
    });
    test({
        input: 0.3109513,
        expected: 0.3109513
    });
    test({
        input: 1.0000000000001,
        expected: 1.0000000000001
    });
    test({
        input: "1",
        expected: 1
    });
    test({
        input: "100",
        expected: 100
    });
    test({
        input: "-2",
        expected: -2
    });
    test({
        input: "1010101",
        expected: 1010101
    });
    test({
        input: "3.1415",
        expected: 3.1415
    });
    test({
        input: ".3109513",
        expected: 0.3109513
    });
    test({
        input: "0.3109513",
        expected: 0.3109513
    });
    test({
        input: "1.0000000000001",
        expected: 1.0000000000001
    });
    test({
        input: "0x1",
        expected: 1
    });
    test({
        input: "0x64",
        expected: 100
    });
    test({
        input: "-0x2",
        expected: -2
    });
    test({
        input: "0xf69b5",
        expected: 1010101
    });
    test({
        input: new BigNumber(1),
        expected: 1
    });
    test({
        input: new BigNumber(100),
        expected: 100
    });
    test({
        input: new BigNumber("-2"),
        expected: -2
    });
    test({
        input: new BigNumber(1010101),
        expected: 1010101
    });
    test({
        input: new BigNumber("3.1415"),
        expected: 3.1415
    });
    test({
        input: new BigNumber(".3109513"),
        expected: 0.3109513
    });
    test({
        input: new BigNumber("0.3109513"),
        expected: 0.3109513
    });
    test({
        input: new BigNumber("1.000000000000000000000000000001"),
        expected: 1.00000000000000000000000000000
    });
    test({
        input: [1, 2, 3],
        expected: [1, 2, 3]
    });
    test({
        input: [1, 2, "3"],
        expected: [1, 2, 3]
    });
    test({
        input: [0],
        expected: [0]
    });
    test({
        input: ["0x1", new BigNumber(2), -2, 0, "1010101"],
        expected: [1, 2, -2, 0, 1010101]
    });

});

describe("format_address: format ethereum address", function () {

    var test = function (t) {
        it(t.address + " -> " + t.expected, function () {
            assert.strictEqual(abi.format_address(t.address), t.expected);
        });
    };

    test({
        address: "0x000000000000000000000000639b41c4d3d399894f2a57894278e1653e7cd24c",
        expected: "0x639b41c4d3d399894f2a57894278e1653e7cd24c"
    });
    test({
        address: "0x000000000000000000000000039b41c4d3d399894f2a57894278e1653e7cd24c",
        expected: "0x039b41c4d3d399894f2a57894278e1653e7cd24c"
    });
    test({
        address: "0x000000000000000000000000009b41c4d3d399894f2a57894278e1653e7cd24c",
        expected: "0x009b41c4d3d399894f2a57894278e1653e7cd24c"
    });
    test({
        address: "0x000000000000000000000000000b41c4d3d399894f2a57894278e1653e7cd24c",
        expected: "0x000b41c4d3d399894f2a57894278e1653e7cd24c"
    });
    test({
        address: "0x000000000000000000000000639b41c4d3d399894f2a57894278e1653e7cd000",
        expected: "0x639b41c4d3d399894f2a57894278e1653e7cd000"
    });
    test({
        address: "0x000000000000000000000000009b41c4d3d399894f2a57894278e1653e7cd240",
        expected: "0x009b41c4d3d399894f2a57894278e1653e7cd240"
    });
    test({
        address: "0x0000000000000000000000000000000000000000000000000000000000000000",
        expected: "0x0000000000000000000000000000000000000000"
    });
    test({
        address: "0x0000000000000000000000000000000000000000000000000000000000000001",
        expected: "0x0000000000000000000000000000000000000001"
    });
    test({
        address: "0x0000000000000000000000000000000000000000000000000000010000000000",
        expected: "0x0000000000000000000000000000010000000000"
    });
    test({
        address: "0x10000000000",
        expected: "0x0000000000000000000000000000010000000000"
    });
    test({
        address: "0x1",
        expected: "0x0000000000000000000000000000000000000001"
    });
    test({
        address: "0x000000000000000000000000b41c4d3d399894f2a57894278e1653e7cd24c",
        expected: "0x000b41c4d3d399894f2a57894278e1653e7cd24c"
    });

});

describe("Fixed point tests", function () {

    var ex_integer = 12345678901;
    var ex_decimal = 0.123456789;
    var ex_integer_hex = "0x2dfdc1c35";
    var ex_integer_string = "12345678901";
    var ex_decimal_string = "0.123456789";

    describe("bignum", function () {
        it("should be the same if called with a float or a string", function () {
            assert(abi.bignum(ex_decimal).eq(abi.bignum(ex_decimal_string)));
        });
        it("should create 0 successfully", function () {
            assert(abi.bignum(0).eq(new BigNumber(0)));
        });
    });

    describe("fix", function () {
        it("should be equal to round(n*2^64)", function () {
            assert(abi.fix(ex_decimal, "BigNumber").eq((new BigNumber(ex_decimal)).mul(abi.constants.ONE).round()));
        });
        it("should return a base 10 string '2277375790844960561'", function () {
            assert(abi.fix(ex_decimal, "string") === "2277375790844960561");
        });
        it("should return a base 16 string '0x1f9add3739635f31'", function () {
            assert(abi.fix(ex_decimal_string, "hex") === "0x1f9add3739635f31");
        });
    });

    describe("unfix", function () {
        it("fixed-point -> hex", function () {
            assert.strictEqual(abi.unfix(abi.fix(ex_integer_hex, "BigNumber"), "hex"), ex_integer_hex);
        });
        it("fixed-point -> string", function () {
            assert.strictEqual(abi.unfix(abi.fix(ex_integer_string, "BigNumber"), "string"), ex_integer_string);
        });
        it("fixed-point -> number", function () {
            assert.strictEqual(abi.unfix(abi.fix(ex_integer_string, "BigNumber"), "number"), ex_integer);
        });
    });
});

describe("is_numeric", function () {

    var test_numbers = [ 1, -2, "1", "10", 2.5, 0, "125000", 2.15315135, -10000 ];
    var test_nans = [ "hello", "testing", NaN, "1oo" ];

    it.each(test_numbers, "%s is a number", ["element"], function (element, next) {
        assert(abi.is_numeric(element));
        next();
    });
    
    it.each(test_nans, "%s is not a number", ["element"], function (element, next) {
        assert(!abi.is_numeric(element));
        next();
    });

});

describe("pad_right", function () {
    var test = function (t) {
        it(t.value + " -> " + t.expected, function () {
            assert.strictEqual(abi.pad_right(t.value), t.expected);
        });
    };
    test({
        value:    "0",
        expected: "0000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "1",
        expected: "1000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775",
        expected: "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"
    });
    test({
        value:    "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e",
        expected: "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e"
    });
    test({
        value:    "123456789",
        expected: "1234567890000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "000000000123456789",
        expected: "0000000001234567890000000000000000000000000000000000000000000000"
    });
    test({
        value:    "1234567890000000000000000000000000000000000000000000000000000000"+
                  "1",
        expected: "1234567890000000000000000000000000000000000000000000000000000000"+
                  "1000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "00000000000000000000000000000000000000000000000000000000000000a5"+
                  "000000000000000000000000000000000000000000000000000000000000003b"+
                  "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"+
                  "7220427265616b64616e63696e6720436f6d7065746974696f6e3f",
        expected: "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "00000000000000000000000000000000000000000000000000000000000000a5"+
                  "000000000000000000000000000000000000000000000000000000000000003b"+
                  "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"+
                  "7220427265616b64616e63696e6720436f6d7065746974696f6e3f0000000000"
    });
});

describe("pad_left", function () {
    var test = function (t) {
        it(t.value + " -> " + t.expected, function () {
            assert.strictEqual(abi.pad_left(t.value), t.expected);
        });
    };
    test({
        value:    "0",
        expected: "0000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "1",
        expected: "0000000000000000000000000000000000000000000000000000000000000001"
    });
    test({
        value:    "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775",
        expected: "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"
    });
    test({
        value:    "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e",
        expected: "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e"
    });
    test({
        value:    "123456789",
        expected: "0000000000000000000000000000000000000000000000000000000123456789"
    });
    test({
        value:    "000000000123456789",
        expected: "0000000000000000000000000000000000000000000000000000000123456789"
    });
    test({
        value:    "1234567890000000000000000000000000000000000000000000000000000000"+
                  "1",
        expected: "0000000000000000000000000000000000000000000000000000000000000001"+
                  "2345678900000000000000000000000000000000000000000000000000000001"
    });
    test({
        value:    "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "00000000000000000000000000000000000000000000000000000000000000a5"+
                  "000000000000000000000000000000000000000000000000000000000000003b"+
                  "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"+
                  "7220427265616b64616e63696e6720436f6d7065746974696f6e3f",
        expected: "0000000000000000000000000000000000000000000000000000000000000000"+
                  "0000000001000000000000000000000000000000000000000000000000000000"+
                  "0000000002000000000000000000000000000000000000000000000000000000"+
                  "00000000a5000000000000000000000000000000000000000000000000000000"+
                  "000000003b57696c6c204a61636b2077696e20746865204a756e652032303135"+
                  "20417567757220427265616b64616e63696e6720436f6d7065746974696f6e3f"
    });
});

describe("chunk", function () {
    var test = function (t) {
        it(t.value + " -> " + t.expected, function () {
            assert.strictEqual(abi.chunk(t.value), t.expected);
        });
    };
    test({ value: 0, expected: 0 });
    test({ value: 1, expected: 1 });
    test({ value: 32, expected: 1 });
    test({ value: 63, expected: 1 });
    test({ value: 64, expected: 1 });
    test({ value: 65, expected: 2 });
    test({ value: 127, expected: 2 });
    test({ value: 128, expected: 2 });
    test({ value: 160, expected: 3 });
    test({ value: 255, expected: 4 });
    test({ value: 256, expected: 4 });
});

describe("offset", function () {
    var test = function (t) {
        it(t.value + " -> " + t.expected, function () {
            assert.strictEqual(abi.offset(t.len, t.num_params), t.expected);
        });
    };
    test({
        len: 1,
        num_params: 1,
        expected: "0000000000000000000000000000000000000000000000000000000000000040"
    });
    test({
        len: 2,
        num_params: 1,
        expected: "0000000000000000000000000000000000000000000000000000000000000040"
    });
    test({
        len: 4,
        num_params: 2,
        expected: "0000000000000000000000000000000000000000000000000000000000000060"
    });
    test({
        len: 12,
        num_params: 4,
        expected: "00000000000000000000000000000000000000000000000000000000000000a0"
    });
    test({
        len: 3,
        num_params: 12,
        expected: "00000000000000000000000000000000000000000000000000000000000001a0"
    });
    test({
        len: 2,
        num_params: 100,
        expected: "0000000000000000000000000000000000000000000000000000000000000ca0"
    });
    test({
        len: 15,
        num_params: 29,
        expected: "00000000000000000000000000000000000000000000000000000000000003c0"
    });
    test({
        len: 256,
        num_params: 256,
        expected: "0000000000000000000000000000000000000000000000000000000000002080"
    });
});

describe("encode_int256", function () {
    var test = function (t) {
        it(t.value + " -> " + t.expected, function () {
            var r = { chunks: 0, statics: '' };
            r = abi.encode_int256(r, t.value);
            assert.strictEqual(r.chunks, 1);
            assert.strictEqual(r.statics, t.expected);
        });
    };
    test({
        value: 1,
        expected: "0000000000000000000000000000000000000000000000000000000000000001"
    });
    test({
        value: 2,
        expected: "0000000000000000000000000000000000000000000000000000000000000002"
    });
    test({
        value: 3,
        expected: "0000000000000000000000000000000000000000000000000000000000000003"
    });
    test({
        value: 16,
        expected: "0000000000000000000000000000000000000000000000000000000000000010"
    });
    test({
        value: -1,
        expected: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    });
    test({
        value: 250000,
        expected: "000000000000000000000000000000000000000000000000000000000003d090"
    });
});

describe("encode_bytesN", function () {
    var test = function (t) {
        it(t.value + " -> " + t.expected, function () {
            var r = { chunks: 0, statics: '' };
            r = abi.encode_bytesN(r, t.value, t.bytes);
            assert.strictEqual(r.statics, t.expected);
        });
    };
    test({ 
        bytes: 32,
        value: "gavofyork",
        expected: "6761766f66796f726b0000000000000000000000000000000000000000000000"
    });
    test({
        bytes: 10,
        value: "1234567890",
        expected: "3132333435363738393000000000000000000000000000000000000000000000"
    });
    test({
        bytes: 32,
        value: "jack",
        expected: "6a61636b00000000000000000000000000000000000000000000000000000000"
    });
    test({
        bytes: 8,
        value: "tinybike",
        expected: "74696e7962696b65000000000000000000000000000000000000000000000000"
    });
    test({
        bytes: 72,
        value: "tinybike",
        expected: "74696e7962696b65000000000000000000000000000000000000000000000000"
    });
    test({
        bytes: 72,
        value: "tinybiketinybiketinybiketinybike"+
               "tinybiketinybiketinybiketinybike"+
               "tinybike",
        expected: "74696e7962696b6574696e7962696b6574696e7962696b6574696e7962696b65"+
                  "74696e7962696b6574696e7962696b6574696e7962696b6574696e7962696b65"+
                  "74696e7962696b65000000000000000000000000000000000000000000000000"
    });
});

describe("encode_hex", function () {

    var tests = [
        { value: "The ultimate solution to global warming will be geoengineering (defined as a majority of research papers claiming this is why temps dropped)",
          expected: "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c207761726d696e672077696c6c2062652067656f656e67696e656572696e672028646566696e65642061732061206d616a6f72697479206f662072657365617263682070617065727320636c61696d696e672074686973206973207768792074656d70732064726f7070656429" },
        { value: "Will an AI beat the Turing test by 2020?",
          expected: "57696c6c20616e20414920626561742074686520547572696e67207465737420627920323032303f" },
        { value: "The US Congress will pass the Freedom Act",
          expected: "54686520555320436f6e67726573732077696c6c2070617373207468652046726565646f6d20416374" },
        { value: "The ultimate solution to global warming will be a decrease in emissions (defined as a majority of research papers claiming this is why temps dropped)",
          expected: "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c207761726d696e672077696c6c206265206120646563726561736520696e20656d697373696f6e732028646566696e65642061732061206d616a6f72697479206f662072657365617263682070617065727320636c61696d696e672074686973206973207768792074656d70732064726f7070656429" },
        { value: "Apple will release a car before 2018",
          expected: "4170706c652077696c6c2072656c65617365206120636172206265666f72652032303138" },
        { value: "Sub $10000 small contained nuclear fission reactors will exist by 2030",
          expected: "5375622024313030303020736d616c6c20636f6e7461696e6564206e75636c6561722066697373696f6e2072656163746f72732077696c6c2065786973742062792032303330" },
        { value: "Cold fusion will be achieved before 2020",
          expected: "436f6c6420667573696f6e2077696c6c206265206163686965766564206265666f72652032303230" },
        { value: "Will laws be passed banning end to end encrypted personal communications in the UK during 2016 ?",
          expected: "57696c6c206c617773206265207061737365642062616e6e696e6720656e6420746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e69636174696f6e7320696e2074686520554b20647572696e672032303136203f" },
        { value: [1,2,3,{test: "data"}], expected: "5b312c322c332c7b2274657374223a2264617461227d5d"},
        { value: {test: "test"}, expected: "7b2274657374223a2274657374227d"}
    ];

    tests.forEach(function (test) {
        it("should turn " + test.value + " to " + test.expected, function () {
            assert.strictEqual(abi.encode_hex(test.value), test.expected);
        });
    });

});

describe("encode_bytes", function () {
    var test = function (t) {
        it(t.hex + " -> " + t.ascii, function () {
            var decoded = abi.decode_hex(t.hex, true);
            assert.strictEqual(decoded, t.ascii);
        });
        it(t.ascii + " -> " + abi.remove_trailing_zeros(t.hex.slice(130)), function () {
            var encoded = abi.encode_hex(t.ascii);
            var expected = abi.remove_trailing_zeros(t.hex.slice(130));
            assert.strictEqual(encoded, expected);
        });
    };
    test({
        hex: "0x"+
            "0000000000000000000000000000000000000000000000000000000000000020"+
            "000000000000000000000000000000000000000000000000000000000000008c"+
            "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
            "7761726d696e672077696c6c2062652067656f656e67696e656572696e672028"+
            "646566696e65642061732061206d616a6f72697479206f662072657365617263"+
            "682070617065727320636c61696d696e67207468697320697320776879207465"+
            "6d70732064726f70706564290000000000000000000000000000000000000000",
        ascii: "The ultimate solution to global warming will be "+
            "geoengineering (defined as a majority of research papers "+
            "claiming this is why temps dropped)"
    });
    test({
        hex: "0x"+
            "0000000000000000000000000000000000000000000000000000000000000020"+
            "0000000000000000000000000000000000000000000000000000000000000028"+
            "57696c6c20616e20414920626561742074686520547572696e67207465737420"+
            "627920323032303f000000000000000000000000000000000000000000000000",
        ascii: "Will an AI beat the Turing test by 2020?"
    });
    test({
        hex: "0x"+
            "0000000000000000000000000000000000000000000000000000000000000020"+
            "0000000000000000000000000000000000000000000000000000000000000029"+
            "54686520555320436f6e67726573732077696c6c207061737320746865204672"+
            "6565646f6d204163740000000000000000000000000000000000000000000000",
        ascii: "The US Congress will pass the Freedom Act"
    });
    test({
        hex: "0x"+
            "0000000000000000000000000000000000000000000000000000000000000020"+
            "0000000000000000000000000000000000000000000000000000000000000095"+
            "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
            "7761726d696e672077696c6c206265206120646563726561736520696e20656d"+
            "697373696f6e732028646566696e65642061732061206d616a6f72697479206f"+
            "662072657365617263682070617065727320636c61696d696e67207468697320"+
            "6973207768792074656d70732064726f70706564290000000000000000000000",
        ascii: "The ultimate solution to global warming will be a decrease in "+
            "emissions (defined as a majority of research papers claiming this"+
            " is why temps dropped)"
    });
    test({
        hex: "0x"+
            "0000000000000000000000000000000000000000000000000000000000000020"+
            "0000000000000000000000000000000000000000000000000000000000000024"+
            "4170706c652077696c6c2072656c65617365206120636172206265666f726520"+
            "3230313800000000000000000000000000000000000000000000000000000000",
        ascii: "Apple will release a car before 2018"
    });
    test({
        hex: "0x"+
            "0000000000000000000000000000000000000000000000000000000000000020"+
            "0000000000000000000000000000000000000000000000000000000000000046"+
            "5375622024313030303020736d616c6c20636f6e7461696e6564206e75636c65"+
            "61722066697373696f6e2072656163746f72732077696c6c2065786973742062"+
            "7920323033300000000000000000000000000000000000000000000000000000",
        ascii: "Sub $10000 small contained nuclear fission reactors will "+
            "exist by 2030"
    });
    test({
        hex: "0x"+
            "0000000000000000000000000000000000000000000000000000000000000020"+
            "0000000000000000000000000000000000000000000000000000000000000028"+
            "436f6c6420667573696f6e2077696c6c20626520616368696576656420626566"+
            "6f72652032303230000000000000000000000000000000000000000000000000",
        ascii: "Cold fusion will be achieved before 2020"
    });
    test({
        hex: "0x"+
            "0000000000000000000000000000000000000000000000000000000000000020"+
            "0000000000000000000000000000000000000000000000000000000000000060"+
            "57696c6c206c617773206265207061737365642062616e6e696e6720656e6420"+
            "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e"+
            "69636174696f6e7320696e2074686520554b20647572696e672032303136203f",
        ascii: "Will laws be passed banning end to end encrypted personal "+
            "communications in the UK during 2016 ?"
    });
});

describe("encode_int256a", function () {
    var test = function (t) {
        it(t.value + " -> " + t.expected, function () {
            var r = { chunks: 0, statics: '', dynamics: '' };
            r = abi.encode_int256a(r, t.value, 1);
            var encoded = r.statics + r.dynamics;
            assert.strictEqual(encoded, t.expected);
            assert.strictEqual(r.chunks, 0);
        });
    };
    test({
        value: [3],
        expected: "0000000000000000000000000000000000000000000000000000000000000020"+
                  "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000003"

    });
    test({
        value: [2, 3],
        expected: "0000000000000000000000000000000000000000000000000000000000000020"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000003"

    });
    test({
        value: [4, 7],
        expected: "0000000000000000000000000000000000000000000000000000000000000020"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000004"+
                  "0000000000000000000000000000000000000000000000000000000000000007"
    });
    test({
        value: [1, 2, 3],
        expected: "0000000000000000000000000000000000000000000000000000000000000020"+
                  "0000000000000000000000000000000000000000000000000000000000000003"+
                  "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000003"

    });
});

describe("encode_prefix", function () {
    var test = function (t) {
        it(t.method + ":" + t.signature + " -> " + t.expected, function () {
            var actual = abi.encode_prefix(t.method, t.signature);
            assert.strictEqual(actual, t.expected);
        });
    };
    test({
        method: "ten",
        signature: "",
        expected: "0x643ceff9"
    });
    test({
        method: "faucet",
        signature: "",
        expected: "0xde5f72fd"
    });
    test({
        method: "getBranches",
        signature: "",
        expected: "0xc3387858"
    });
    test({
        method: "double",
        signature: "i",
        expected: "0x6ffa1caa"
    });
    test({
        method: "getMarkets",
        signature: "i",
        expected: "0xb3903c8a"
    });
    test({
        method: "getVotePeriod",
        signature: "i",
        expected: "0x7a66d7ca"
    });
    test({
        method: "getDescription",
        signature: "i",
        expected: "0x37e7ee00"
    });
    test({
        method: "getEventInfo",
        signature: "i",
        expected: "0x1aecdb5b"
    });
    test({
        method: "multiply",
        signature: "ii",
        expected: "0x3c4308a8"
    });
    test({
        method: "sendReputation",
        signature: "iii",
        expected: "0xa677135c"
    });
    test({
        method: "double",
        signature: "a",
        expected: "0x8de53e9"
    });
    test({
        method: "slashRep",
        signature: "iiiai",
        expected: "0x660a246c"
    });
    test({
        method: "createEvent",
        signature: "isiiii",
        expected: "0x130dd1b3"
    });
    test({
        method: "createEvent",
        signature: "isiiiii",
        expected: "0xf0061fd5"
    });
    test({
        method: "createMarket",
        signature: "isiiia",
        expected: "0x8d19b3f"
    });
    test({
        method: "createMarket",
        signature: "isiiiai",
        expected: "0x8df6a0cc"
    });
});

describe("encode_data", function () {
    var test = function (t) {
        it(JSON.stringify(t.params) + ":" + t.signature + " -> " + t.expected, function () {
            var encoded = abi.encode_data(t);
            var web3_encoded = coder.encodeParams(t.types, t.params);
            assert.strictEqual(encoded, t.expected);
            assert.strictEqual(encoded, web3_encoded);
        });
    };
    test({
        signature: "i",
        types: ["int256"],
        params: [3],
        expected: "0000000000000000000000000000000000000000000000000000000000000003"
    });
    test({
        signature: "i",
        types: ["int256"],
        params: [1010101],
        expected: "00000000000000000000000000000000000000000000000000000000000f69b5"
    });
    test({
        signature: "i",
        types: ["int256"],
        params: [1010101],
        expected: "00000000000000000000000000000000000000000000000000000000000f69b5"
    });
    test({
        signature: "i",
        types: ["int256"],
        params: ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"],
        expected: "b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"
    });
    test({
        signature: "i",
        types: ["int256"],
        params: ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"],
        expected: "b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"
    });
    test({
        signature: "a",
        types: ["int256[]"],
        params: [[3]],
        expected: "0000000000000000000000000000000000000000000000000000000000000020"+
                  "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000003"

    });
    test({
        signature: "a",
        types: ["int256[]"],
        params: [[2, 3]],
        expected: "0000000000000000000000000000000000000000000000000000000000000020"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000003"

    });
    test({
        signature: "a",
        types: ["int256[]"],
        params: [[4, 7]],
        expected: "0000000000000000000000000000000000000000000000000000000000000020"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000004"+
                  "0000000000000000000000000000000000000000000000000000000000000007"
    });
    test({
        signature: "a",
        types: ["int256[]"],
        params: [[1, 2, 3]],
        expected: "0000000000000000000000000000000000000000000000000000000000000020"+
                  "0000000000000000000000000000000000000000000000000000000000000003"+
                  "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000003"

    });
    test({
        signature: "aa",
        types: ["int256[]", "int256[]"],
        params: [[1, 2], [3, 4]],
        expected: "0000000000000000000000000000000000000000000000000000000000000040"+
                  "00000000000000000000000000000000000000000000000000000000000000a0"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000003"+
                  "0000000000000000000000000000000000000000000000000000000000000004"
    });
    test({
        signature: "b32i",
        types: ["bytes32", "int256"],
        params: ["gavofyork", 5],
        expected: "6761766f66796f726b0000000000000000000000000000000000000000000000"+
                  "0000000000000000000000000000000000000000000000000000000000000005"
    });
    test({
        signature: "ib32",
        types: ["int256", "bytes32"],
        params: [5, "gavofyork"],
        expected: "0000000000000000000000000000000000000000000000000000000000000005"+
                  "6761766f66796f726b0000000000000000000000000000000000000000000000"
    });
    test({
        signature: "sia",
        types: ["bytes", "int256", "int256[]"],
        params: ["gavofyork", 1, [1, 2, 3]],
        expected: "0000000000000000000000000000000000000000000000000000000000000060"+
                  "0000000000000000000000000000000000000000000000000000000000000001"+
                  "00000000000000000000000000000000000000000000000000000000000000a0"+
                  "0000000000000000000000000000000000000000000000000000000000000009"+
                  "6761766f66796f726b0000000000000000000000000000000000000000000000"+
                  "0000000000000000000000000000000000000000000000000000000000000003"+
                  "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000003"
    });
    test({
        signature: "isiiia",
        types: ["int256", "bytes", "int256", "int256", "int256", "int256[]"],
        params: [1, "gavofyork", 2, 3, 4, [5, 6, 7]],
        expected: "0000000000000000000000000000000000000000000000000000000000000001"+
                  "00000000000000000000000000000000000000000000000000000000000000c0"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000003"+
                  "0000000000000000000000000000000000000000000000000000000000000004"+
                  "0000000000000000000000000000000000000000000000000000000000000100"+
                  "0000000000000000000000000000000000000000000000000000000000000009"+
                  "6761766f66796f726b0000000000000000000000000000000000000000000000"+
                  "0000000000000000000000000000000000000000000000000000000000000003"+
                  "0000000000000000000000000000000000000000000000000000000000000005"+
                  "0000000000000000000000000000000000000000000000000000000000000006"+
                  "0000000000000000000000000000000000000000000000000000000000000007"
    });
    test({
        signature: "isiiii",
        types: ["int256", "bytes", "int256", "int256", "int256", "int256"],
        params: [
            "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
            "my event", 250000, 1, 2, 2
        ],
        expected: "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                  "00000000000000000000000000000000000000000000000000000000000000c0"+
                  "000000000000000000000000000000000000000000000000000000000003d090"+
                  "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000008"+
                  "6d79206576656e74000000000000000000000000000000000000000000000000"
    });
    test({
        signature: "iiiai",
        types: ["int256", "int256", "int256", "int256[]", "int256"],
        params: [
            "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
            "1170",
            "1337",
            [1, 2, 1, 1],
            "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89"
        ],
        expected: "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                  "0000000000000000000000000000000000000000000000000000000000000492"+
                  "0000000000000000000000000000000000000000000000000000000000000539"+
                  "00000000000000000000000000000000000000000000000000000000000000a0"+
                  "00000000000000000000000063524e3fe4791aefce1e932bbfb3fdf375bfad89"+
                  "0000000000000000000000000000000000000000000000000000000000000004"+
                  "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000001"
    });
    test({
        signature: "isiiia",
        types: ["int256", "bytes", "int256", "int256", "int256", "int256[]"],
        params: [
            "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
            "market for ragefests",
            "0x1000000000000000",
            "0x2800000000000000000",
            "0x400000000000000",
            ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c",
             "0x4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12",
             "0x412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83"]
        ],
        expected: "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                  "00000000000000000000000000000000000000000000000000000000000000c0"+
                  "0000000000000000000000000000000000000000000000001000000000000000"+
                  "0000000000000000000000000000000000000000000002800000000000000000"+
                  "0000000000000000000000000000000000000000000000000400000000000000"+
                  "0000000000000000000000000000000000000000000000000000000000000100"+
                  "0000000000000000000000000000000000000000000000000000000000000014"+
                  "6d61726b657420666f7220726167656665737473000000000000000000000000"+
                  "0000000000000000000000000000000000000000000000000000000000000003"+
                  "b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"+
                  "4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12"+
                  "412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83"
    });
    test({
        signature: "isiiiai",
        types: ["int256", "bytes", "int256", "int256", "int256", "int256[]", "int256"],
        params: [
            "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
            "market for ragefests",
            "0x1000000000000000",
            "0x2800000000000000000",
            "0x400000000000000",
            ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c",
             "0x4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12",
             "0x412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83"],
            "165"
        ],
        expected: "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                  "00000000000000000000000000000000000000000000000000000000000000e0"+
                  "0000000000000000000000000000000000000000000000001000000000000000"+
                  "0000000000000000000000000000000000000000000002800000000000000000"+
                  "0000000000000000000000000000000000000000000000000400000000000000"+
                  "0000000000000000000000000000000000000000000000000000000000000120"+
                  "00000000000000000000000000000000000000000000000000000000000000a5"+
                  "0000000000000000000000000000000000000000000000000000000000000014"+
                  "6d61726b657420666f7220726167656665737473000000000000000000000000"+
                  "0000000000000000000000000000000000000000000000000000000000000003"+
                  "b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"+
                  "4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12"+
                  "412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83"
    });
});

describe("encode", function () {
    var test = function (t) {
        it(t.method + "(" + JSON.stringify(t.params) + ":" + t.signature + ") -> " + t.expected, function () {
            var prefix, encoded, web3_encoded;
            prefix = abi.encode_prefix(t.method, t.signature);
            encoded = prefix + abi.encode_data(t);
            if (t.types.length) {
                web3_encoded = prefix + coder.encodeParams(t.types, t.params);
            } else {
                web3_encoded = prefix;
            }
            if (encoded !== web3_encoded) {
                console.log("\naugur.js:", chunk32(encoded, null, 10));
                console.log("web3.js: ", chunk32(web3_encoded, null, 10));
                // console.log("expected:", chunk32(t.expected, null, 10));
            }
            // assert.strictEqual(encoded, t.expected);
            assert.strictEqual(encoded, web3_encoded);
        });
    };
    describe("No parameters", function () {
        test({
            method: "ten",
            signature: "",
            types: [],
            expected: "0x643ceff9"
        });
        test({
            method: "faucet",
            signature: "",
            types: [],
            expected: "0xde5f72fd"
        });
        test({
            method: "getBranches",
            signature: "",
            types: [],
            expected: "0xc3387858"
        });
    });
    describe("Single int256 parameter", function () {
        test({
            method: "double",
            signature: "i",
            types: ["int256"],
            params: [3],
            expected: "0x6ffa1caa"+
                "0000000000000000000000000000000000000000000000000000000000000003"
        });
        test({
            method: "getMarkets",
            signature: "i",
            types: ["int256"],
            params: [1010101],
            expected: "0xb3903c8a"+
                "00000000000000000000000000000000000000000000000000000000000f69b5"
        });
        test({
            method: "getVotePeriod",
            signature: "i",
            types: ["int256"],
            params: [1010101],
            expected: "0x7a66d7ca"+
                "00000000000000000000000000000000000000000000000000000000000f69b5"
        });
        test({
            method: "getDescription",
            signature: "i",
            types: ["int256"],
            params: ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"],
            expected: "0x37e7ee00"+
                "b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"
        });
        test({
            method: "getEventInfo",
            signature: "i",
            types: ["int256"],
            params: ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"],
            expected: "0x1aecdb5b"+
                "b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"
        });
    });
    describe("Multiple int256 parameters", function () {
        test({
            method: "multiply",
            signature: "ii",
            types: ["int256", "int256"],
            params: [2, 3],
            expected: "0x3c4308a8"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000003"
        });
        test({
            method: "sendReputation",
            signature: "iii",
            types: ["int256", "int256", "int256"],
            params: [
                1010101,
                "0x6fc0a64e2dce367e35417bfd1568fa35af9f3e4b",
                abi.fix("5").toFixed()
            ],
            expected: "0xa677135c"+
                "00000000000000000000000000000000000000000000000000000000000f69b5"+
                "0000000000000000000000006fc0a64e2dce367e35417bfd1568fa35af9f3e4b"+
                "0000000000000000000000000000000000000000000000050000000000000000"
        });
    });
    describe("Single int256[] parameter", function () {
        test({
            method: "double",
            signature: "a",
            types: ["int256[]"],
            params: [[3]],
            expected: "0x8de53e9"+
                      "0000000000000000000000000000000000000000000000000000000000000020"+
                      "0000000000000000000000000000000000000000000000000000000000000001"+
                      "0000000000000000000000000000000000000000000000000000000000000003"
        });
        test({
            method: "double",
            signature: "a",
            types: ["int256[]"],
            params: [[2, 3]],
            expected: "0x8de53e9"+
                "0000000000000000000000000000000000000000000000000000000000000020"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000003"
        });
        test({
            method: "double",
            signature: "a",
            types: ["int256[]"],
            params: [[4, 7]],
            expected: "0x8de53e9"+
                "0000000000000000000000000000000000000000000000000000000000000020"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000004"+
                "0000000000000000000000000000000000000000000000000000000000000007"
        });
        test({
            method: "double",
            signature: "a",
            types: ["int256[]"],
            params: [[1, 2, 3]],
            expected: "0x8de53e9"+
                "0000000000000000000000000000000000000000000000000000000000000020"+
                "0000000000000000000000000000000000000000000000000000000000000003"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000003"
        });
    });
    describe("Multiple int256[] parameters", function () {
        test({
            method: "testMethod",
            signature: "aa",
            types: ["int256[]", "int256[]"],
            params: [[1, 2], [3, 4]],
            expected: "0x24c55417"+
                "0000000000000000000000000000000000000000000000000000000000000040"+
                "00000000000000000000000000000000000000000000000000000000000000a0"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000003"+
                "0000000000000000000000000000000000000000000000000000000000000004"
        });
    });
    describe("Mixed parameters", function () {
        test({
            method: "testMethod",
            signature: "b32i",
            types: ["bytes32", "int256"],
            params: ["gavofyork", 5],
            expected: "0x1c17917f"+
                "6761766f66796f726b0000000000000000000000000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000005"
        });
        test({
            method: "testMethod",
            signature: "ib32",
            types: ["int256", "bytes32"],
            params: [5, "gavofyork"],
            expected: "0x82e646a6"+
                "0000000000000000000000000000000000000000000000000000000000000005"+
                "6761766f66796f726b0000000000000000000000000000000000000000000000"
        });
        test({
            method: "testMethod",
            signature: "sia",
            types: ["bytes", "int256", "int256[]"],
            params: ["gavofyork", 1, [1, 2, 3]],
            expected: "0x542b5456"+
                "0000000000000000000000000000000000000000000000000000000000000060"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "00000000000000000000000000000000000000000000000000000000000000a0"+
                "0000000000000000000000000000000000000000000000000000000000000009"+
                "6761766f66796f726b0000000000000000000000000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000003"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000003"
        });
        test({
            method: "createMarket",
            signature: "isiiia",
            types: ["int256", "bytes", "int256", "int256", "int256", "int256[]"],
            params: [1, "gavofyork", 2, 3, 4, [5, 6, 7]],
            expected: "0x8d19b3f"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "00000000000000000000000000000000000000000000000000000000000000c0"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000003"+
                "0000000000000000000000000000000000000000000000000000000000000004"+
                "0000000000000000000000000000000000000000000000000000000000000100"+
                "0000000000000000000000000000000000000000000000000000000000000009"+
                "6761766f66796f726b0000000000000000000000000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000003"+
                "0000000000000000000000000000000000000000000000000000000000000005"+
                "0000000000000000000000000000000000000000000000000000000000000006"+
                "0000000000000000000000000000000000000000000000000000000000000007"
        });
        test({
            method: "slashRep",
            signature: "iiiai",
            types: ["int256", "int256", "int256", "int256[]", "int256"],
            params: [
                "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
                "1170",
                "1337",
                [1, 2, 1, 1],
                "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89"
            ],
            expected: "0x660a246c"+
                "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                "0000000000000000000000000000000000000000000000000000000000000492"+
                "0000000000000000000000000000000000000000000000000000000000000539"+
                "00000000000000000000000000000000000000000000000000000000000000a0"+
                "00000000000000000000000063524e3fe4791aefce1e932bbfb3fdf375bfad89"+
                "0000000000000000000000000000000000000000000000000000000000000004"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000001"
        });
        test({
            method: "createEvent",
            signature: "isiiii",
            types: ["int256", "bytes", "int256", "int256", "int256", "int256"],
            params: [
                "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
                "my event", 250000, 1, 2, 2
            ],
            expected: "0x130dd1b3"+
                "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                "00000000000000000000000000000000000000000000000000000000000000c0"+
                "000000000000000000000000000000000000000000000000000000000003d090"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000008"+
                "6d79206576656e74000000000000000000000000000000000000000000000000"
        });
        test({
            method: "createEvent",
            signature: "isiiiii",
            types: ["int256", "bytes", "int256", "int256", "int256", "int256", "int256"],
            params: [
                "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
                "augur ragefest 2015", 250000, 1, 2, 2, 165
            ],
            expected: "0xf0061fd5"+
                "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                "00000000000000000000000000000000000000000000000000000000000000e0"+
                "000000000000000000000000000000000000000000000000000000000003d090"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "00000000000000000000000000000000000000000000000000000000000000a5"+
                "0000000000000000000000000000000000000000000000000000000000000013"+
                "6175677572207261676566657374203230313500000000000000000000000000"
        });
        test({
            method: "createEvent",
            signature: "isiiiii",
            types: ["int256", "bytes", "int256", "int256", "int256", "int256", "int256"],
            params: [
                "0x3d595622e5444dd258670ab405b82a467117bd9377dc8fa8c4530528242fe0c5",
                "Will Jack win the June 2015 augur Breakdancing Competition?",
                800029, 0, 1, 2, "165"
            ],
            expected: "0xf0061fd5"+
                "3d595622e5444dd258670ab405b82a467117bd9377dc8fa8c4530528242fe0c5"+
                "00000000000000000000000000000000000000000000000000000000000000e0"+
                "00000000000000000000000000000000000000000000000000000000000c351d"+
                "0000000000000000000000000000000000000000000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "00000000000000000000000000000000000000000000000000000000000000a5"+
                "000000000000000000000000000000000000000000000000000000000000003b"+
                "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"+
                "7220427265616b64616e63696e6720436f6d7065746974696f6e3f"
        });
        test({
            method: "createMarket",
            signature: "isiiia",
            types: ["int256", "bytes", "int256", "int256", "int256", "int256[]"],
            params: [
                "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
                "market for ragefests",
                "0x1000000000000000",
                "0x2800000000000000000",
                "0x400000000000000",
                ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c",
                 "0x4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12",
                 "0x412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83"]
            ],
            expected: "0x8d19b3f3"+
                "8a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b181321339910"+
                "0000000000000000000000000000000000000000000000000000000000000c00"+
                "0000000000000000000000000000000000000000000000010000000000000000"+
                "0000000000000000000000000000000000000000000028000000000000000000"+
                "0000000000000000000000000000000000000000000000004000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000001000"+
                "0000000000000000000000000000000000000000000000000000000000000146"+
                "d61726b657420666f72207261676566657374730000000000000000000000000"+
                "000000000000000000000000000000000000000000000000000000000000003b"+
                "2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c4"+
                "f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b124"+
                "12b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83"
        });
        test({
            method: "createMarket",
            signature: "isiiiai",
            types: ["int256", "bytes", "int256", "int256", "int256", "int256[]", "int256"],
            params: [
                "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
                "market for ragefests",
                "0x1000000000000000",
                "0x2800000000000000000",
                "0x400000000000000",
                ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c",
                 "0x4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12",
                 "0x412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83"],
                "165"
            ],
            expected: "0x8df6a0cc"+
                "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                "00000000000000000000000000000000000000000000000000000000000000e0"+
                "0000000000000000000000000000000000000000000000001000000000000000"+
                "0000000000000000000000000000000000000000000002800000000000000000"+
                "0000000000000000000000000000000000000000000000000400000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000120"+
                "00000000000000000000000000000000000000000000000000000000000000a5"+
                "0000000000000000000000000000000000000000000000000000000000000014"+
                "6d61726b657420666f7220726167656665737473000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000003"+
                "b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"+
                "4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12"+
                "412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83"
        });

        // negative event hash
        test({
            method: "createMarket",
            signature: "isiiiai",
            types: ["int256", "bytes", "int256", "int256", "int256", "int256[]", "int256"],
            params: [
                "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
                "unicorns are real",
                "0x10000000000000000",
                "0xa0000000000000000",
                "0xa0000000000000000",
                ["-0x2ae31f0184fa3e11a1517a11e3fc6319cb7c310cee36b20f8e0263049b1f3a6f"],
                "165"
            ],
            expected: "0x8df6a0cc"+
                "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
                "00000000000000000000000000000000000000000000000000000000000000e0"+
                "0000000000000000000000000000000000000000000000010000000000000000"+
                "00000000000000000000000000000000000000000000000a0000000000000000"+
                "00000000000000000000000000000000000000000000000a0000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000120"+
                "00000000000000000000000000000000000000000000000000000000000000a5"+
                "0000000000000000000000000000000000000000000000000000000000000011"+
                "756e69636f726e7320617265207265616c000000000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "d51ce0fe7b05c1ee5eae85ee1c039ce63483cef311c94df071fd9cfb64e0c591"
        });
        test({
            print: true,
            method: "createMarket",
            signature: "isiiiai",
            types: ["int256", "bytes", "int256", "int256", "int256", "int256[]", "int256"],
            params: [
                1010101,
                "Will the Sun turn into a red giant and engulf the Earth by the end of 2015?",
                "0.0079",
                1000,
                "0.02",
                ["-0x29ccc80fb51d4a6cf0855251cbca882f6afea3a93e12b3722d2401fccddc41f2"],
                "10000"
            ],
            expected: "0x8df6a0cc"+
                "00000000000000000000000000000000000000000000000000000000000f69b5"+
                "00000000000000000000000000000000000000000000000000000000000000e0"+
                "0000000000000000000000000000000000000000000000000000000000000000"+
                "00000000000000000000000000000000000000000000000000000000000003e8"+
                "0000000000000000000000000000000000000000000000000000000000000000"+
                "000000000000000000000000000000000000000000000000000000000000014b"+
                "0000000000000000000000000000000000000000000000000000000000002710"+
                "000000000000000000000000000000000000000000000000000000000000004b"+
                "57696c6c207468652053756e207475726e20696e746f20612072656420676961"+
                "6e7420616e6420656e67756c6620746865204561727468206279207468652065"+
                "6e64206f6620323031353f000000000000000000000000000000000000000000"+
                "0000000000000000000001d63337f04ae2b5930f7aadae343577d095015c56c1"+
                "ed4c8dd2dbfe033223be0e"
        });
    });
});
