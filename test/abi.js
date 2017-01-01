/**
 * Unit tests for augur-abi.
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var abi = require("../");
abi.debug = false;

require('it-each')({testPerIteration: true});

function toArray(buffer) {
    var ab = new Array(buffer.length);
    for (var i = 0; i < buffer.length; ++i) {
        ab[i] = "0x" + buffer[i].toString(16);
    }
    return ab;
}

describe("hex: hexadecimal conversion", function () {

    // from web3.js toHex tests
    var tests = [
        {value: 1, expected: "0x1"},
        {value: "1", expected: "0x1"},
        {value: "0x1", expected: "0x1"},
        {value: "15", expected: "0xf"},
        {value: "0xf", expected: "0xf"},
        {value: -1, expected: "-0x1"},
        {value: "-1", expected: "-0x1"},
        {value: "-0x1", expected: "-0x1"},
        {value: "-15", expected: "-0xf"},
        {value: "-0xf", expected: "-0xf"},
        {value: "0x657468657265756d", expected: "0x657468657265756d"},
        {value: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd",
         expected: "-0x3"},
        {value: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
         expected: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"},
        {value: "0x8000000000000000000000000000000000000000000000000000000000000000",
         expected: "-0x8000000000000000000000000000000000000000000000000000000000000000"},
        {value: "0x8000000000000000000000000000000000000000000000000000000000000001",
         expected: "-0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"},
        {value: "-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
         expected: "0x1"},
        {value: "-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd",
         expected: "0x3"},
        {value: "-0x8000000000000000000000000000000000000000000000000000000000000000",
         expected: "-0x8000000000000000000000000000000000000000000000000000000000000000"},
        {value: "-0x8000000000000000000000000000000000000000000000000000000000000001",
         expected: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"},
        {value: 0, expected: "0x0"},
        {value: "0", expected: "0x0"},
        {value: "0x0", expected: "0x0"},
        {value: -0, expected: "0x0"},
        {value: "-0", expected: "0x0"},
        {value: "-0x0", expected: "0x0"},
        {value: '{"test": "test"}', expected: "0x7b2274657374223a202274657374227d"},
        {value: {test: "test"}, expected: "0x7b2274657374223a2274657374227d"},
        {value: "\ttabbity", expected: "0x0974616262697479"},
        {value: "myString", expected: "0x6d79537472696e67"},
        {value: new BigNumber(15), expected: "0xf"},
        {value: true, expected: "0x1"},
        {value: false, expected: "0x0"},
        {value: [1, 2, 3], expected: ["0x1", "0x2", "0x3"]},
        {value: [1, 2, "3"], expected: ["0x1", "0x2", "0x3"]},
        {value: [0], expected: ["0x0"]},
        {value: ["0x1", new BigNumber(2), -2, 0, "1010101"],
          expected: ["0x1", "0x2", "-0x2", "0x0", "0xf69b5"]},
        {value: new Buffer("0f69b5", "hex"), expected: "0x0f69b5"}
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

describe("unfork", function () {

    var test = function (t) {
        it("convert " + t.forked + " to " + t.unforked, function () {
            var unforked = abi.unfork(t.forked, true);
            if (unforked.constructor === BigNumber) {
                unforked = abi.hex(unforked);
            }
            assert.strictEqual(unforked, t.unforked);
        });
    };

    test({
        forked: "-0xeb05bd7c87137434b0dab4b058d1c4f07059415f4c3476b14e6fffdc9e9b103",
        unforked: "0xf14fa428378ec8bcb4f254b4fa72e3b0f8fa6bea0b3cb894eb19000236164efd"
    });
    test({
        forked: new BigNumber("-eb05bd7c87137434b0dab4b058d1c4f07059415f4c3476b14e6fffdc9e9b103", 16),
        unforked: "0xf14fa428378ec8bcb4f254b4fa72e3b0f8fa6bea0b3cb894eb19000236164efd"
    });
    test({
        forked: "0xf14fa428378ec8bcb4f254b4fa72e3b0f8fa6bea0b3cb894eb19000236164efd",
        unforked: "0xf14fa428378ec8bcb4f254b4fa72e3b0f8fa6bea0b3cb894eb19000236164efd"
    });
    test({
        forked: "0x07f75ade249292c9a8f0214f406e055e1f4c8d850090ab8638856ead8a1a920a",
        unforked: "0x07f75ade249292c9a8f0214f406e055e1f4c8d850090ab8638856ead8a1a920a"
    });
    test({
        forked: "0xeac61bc93ac400f2749e2a318d0b6cc66b77b6d616c9d9c7c4b785ea623c961b",
        unforked: "0xeac61bc93ac400f2749e2a318d0b6cc66b77b6d616c9d9c7c4b785ea623c961b"
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

describe("format_int256", function () {

    var test = function (t) {
        it(t.input + " -> " + t.expected, function () {
            assert.strictEqual(abi.format_int256(t.input), t.expected);
        });
    };

    test({
        input: "0x1",
        expected: "0x0000000000000000000000000000000000000000000000000000000000000001"
    });
    test({
        input: "0xec77eede1b373cae5f1c7f2c5167669fbf94f5c5b517b0f187256894264275d8",
        expected: "0xec77eede1b373cae5f1c7f2c5167669fbf94f5c5b517b0f187256894264275d8"
    });
    test({
        input: "0x1111111111111111111111111111111111111111111111111111111111111111",
        expected: "0x1111111111111111111111111111111111111111111111111111111111111111",
    });
    test({
        input: "0x11111111111111111111111111111111111111111111111111111111111111111",
        expected: "0x1111111111111111111111111111111111111111111111111111111111111111",
    });
    test({
        input: "0x11111111111111111111111111111111111111111111111111111111111111112",
        expected: "0x1111111111111111111111111111111111111111111111111111111111111111",
    });
    test({
        input: "oh hi",
        expected: "0x00000000000000000000000000000000000000000000000000000000000oh hi"
    });
    test({
        input: "0x",
        expected: "0x"
    });
    test({
        input: null,
        expected: null
    });
    test({
        input: undefined,
        expected: undefined
    });
    test({
        input: "",
        expected: "0x0000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        input: "0x0",
        expected: "0x0000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        input: "-1234",
        expected: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb2e"
    });
    test({
        input: "-0x1234",
        expected: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedcc"
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

describe("bytes_to_utf16", function () {
    var test = function (t) {
        it(t.bytes + " -> " + t.utf16, function () {
            assert.strictEqual(abi.bytes_to_utf16(t.bytes), t.utf16);
        });
    };
    test({
        bytes: "e381aae3819ce3819de38293e381aae381abe79c9fe589a3e381aae38293e381a0efbc9f20e282ace29883",
        utf16: "なぜそんなに真剣なんだ？ €☃"
    });
    test({
        bytes: new Buffer("e381aae3819ce3819de38293e381aae381abe79c9fe589a3e381aae38293e381a0efbc9f20e282ace29883", "hex"),
        utf16: "なぜそんなに真剣なんだ？ €☃"
    });
    test({
        bytes: toArray("e381aae3819ce3819de38293e381aae381abe79c9fe589a3e381aae38293e381a0efbc9f20e282ace29883"),
        utf16: "なぜそんなに真剣なんだ？ €☃"
    });
});

describe("int256-short string conversions", function () {

    var test = function (t) {
        it(t.int256 + " <-> " + t.short_string, function () {
            assert.strictEqual(t.int256, abi.short_string_to_int256(t.short_string));
            assert.strictEqual(t.short_string, abi.int256_to_short_string(t.int256));
        });
    };

    test({
        short_string: "george",
        int256: "0x67656f7267650000000000000000000000000000000000000000000000000000"
    });
    test({
        short_string: "U.S. Presidential Election",
        int256: "0x552e532e20507265736964656e7469616c20456c656374696f6e000000000000"
    });
    test({
        short_string: "1010101",
        int256: "0x3130313031303100000000000000000000000000000000000000000000000000"
    });
    test({
        short_string: "i'm a",
        int256: "0x69276d2061000000000000000000000000000000000000000000000000000000"
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
        it("should return a base 10 string '123456789000000000'", function () {
            assert.strictEqual(abi.fix(ex_decimal, "string"), "123456789000000000");
        });
        it("should return a base 16 string '0x1b69b4ba5749200'", function () {
            assert.strictEqual(abi.fix(ex_decimal_string, "hex"), "0x1b69b4ba5749200");
        });
        it("should return a base 16 string '0x8a5ca67d92b2910'", function () {
            assert.strictEqual(abi.fix(0.6231266708346084, "hex"), "0x8a5ca67d92b2910");
        });
        it("should return a base 16 string '0x8a5ca67d92b2910'", function () {
            assert.strictEqual(abi.fix("0.6231266708346084", "hex"), "0x8a5ca67d92b2910");
        });
    });

    describe("unfix", function () {
        it("fixed-point -> hex", function () {
            assert.strictEqual(abi.unfix(abi.fix(ex_integer_hex, "BigNumber"), "hex"), ex_integer_hex);
            assert.strictEqual(abi.unfix("0x00000000000000000000000000000000000000000000021a72a75ef8d57ef000", "hex"), "0x26cd");
        });
        it("fixed-point -> string", function () {
            assert.strictEqual(abi.unfix(abi.fix(ex_integer_string, "BigNumber"), "string"), ex_integer_string);
            assert.strictEqual(abi.unfix("0x00000000000000000000000000000000000000000000021a72a75ef8d57ef000", "string"), "9932.60998812");
        });
        it("fixed-point -> number", function () {
            assert.strictEqual(abi.unfix(abi.fix(ex_integer_string, "BigNumber"), "number"), ex_integer);
            assert.strictEqual(abi.unfix("0x00000000000000000000000000000000000000000000021a72a75ef8d57ef000", "number"), 9932.60998812);
        });
    });

    describe("unfix_signed", function () {
        it("fixed-point -> hex", function () {
            assert.strictEqual(abi.unfix_signed("0xfffffffffffffffffffffffffffffffffffffffffffffffff21f494c589c0000", "hex"), "-0x1");
        });
        it("fixed-point -> string", function () {
            assert.strictEqual(abi.unfix_signed("0xfffffffffffffffffffffffffffffffffffffffffffffffff21f494c589c0000", "string"), "-1");
        });
        it("fixed-point -> number", function () {
            assert.strictEqual(abi.unfix_signed("0xfffffffffffffffffffffffffffffffffffffffffffffffff21f494c589c0000", "number"), -1);
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
        it(t.value + "," + t.chunk_len + "," + t.prefix + " -> " + t.expected, function () {
            assert.strictEqual(abi.pad_right(t.value, t.chunk_len, t.prefix), t.expected);
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
    test({
        value:    "0",
        chunk_len: 64,
        expected: "0000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "1",
        chunk_len: 64,
        expected: "1000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775",
        chunk_len: 64,
        expected: "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"
    });
    test({
        value:    "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e",
        chunk_len: 64,
        expected: "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e"
    });
    test({
        value:    "123456789",
        chunk_len: 64,
        expected: "1234567890000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "000000000123456789",
        chunk_len: 64,
        expected: "0000000001234567890000000000000000000000000000000000000000000000"
    });
    test({
        value:    "1234567890000000000000000000000000000000000000000000000000000000"+
                  "1",
        chunk_len: 64,
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
        chunk_len: 64,
        expected: "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "00000000000000000000000000000000000000000000000000000000000000a5"+
                  "000000000000000000000000000000000000000000000000000000000000003b"+
                  "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"+
                  "7220427265616b64616e63696e6720436f6d7065746974696f6e3f0000000000"
    });
    test({
        value:    "0",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "0000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "1",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "1000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"
    });
    test({
        value:    "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e"
    });
    test({
        value:    "123456789",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "1234567890000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "000000000123456789",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "0000000001234567890000000000000000000000000000000000000000000000"
    });
    test({
        value:    "1234567890000000000000000000000000000000000000000000000000000000"+
                  "1",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "1234567890000000000000000000000000000000000000000000000000000000"+
                  "1000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "00000000000000000000000000000000000000000000000000000000000000a5"+
                  "000000000000000000000000000000000000000000000000000000000000003b"+
                  "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"+
                  "7220427265616b64616e63696e6720436f6d7065746974696f6e3f",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "00000000000000000000000000000000000000000000000000000000000000a5"+
                  "000000000000000000000000000000000000000000000000000000000000003b"+
                  "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"+
                  "7220427265616b64616e63696e6720436f6d7065746974696f6e3f0000000000"
    });
    test({
        value:    "0",
        chunk_len: 32,
        expected: "00000000000000000000000000000000"
    });
    test({
        value:    "1",
        chunk_len: 32,
        expected: "10000000000000000000000000000000"
    });
    test({
        value:    "57696c6c204a61636b2077696e207468"+
                  "65204a756e6520323031352041756775",
        chunk_len: 32,
        expected: "57696c6c204a61636b2077696e207468"+
                  "65204a756e6520323031352041756775"
    });
    test({
        value:    "54686520756c74696d61746520736f6c"+
                  "7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e63727970746564"+
                  "20706572736f6e616c20636f6d6d756e",
        chunk_len: 32,
        expected: "54686520756c74696d61746520736f6c"+
                  "7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e63727970746564"+
                  "20706572736f6e616c20636f6d6d756e"
    });
    test({
        value:    "123456789",
        chunk_len: 32,
        expected: "12345678900000000000000000000000"
    });
    test({
        value:    "000000000123456789",
        chunk_len: 32,
        expected: "00000000012345678900000000000000"
    });
    test({
        value:    "12345678900000000000000000000000"+
                  "00000000000000000000000000000000"+
                  "1",
        chunk_len: 32,
        expected: "12345678900000000000000000000000"+
                  "00000000000000000000000000000000"+
                  "10000000000000000000000000000000"
    });
    test({
        value:    "00000000000000000000000000000000"+
                  "00000000000000000000000000000001"+
                  "00000000000000000000000000000000"+
                  "00000000000000000000000000000002"+
                  "00000000000000000000000000000000"+
                  "000000000000000000000000000000a5"+
                  "00000000000000000000000000000000"+
                  "0000000000000000000000000000003b"+
                  "57696c6c204a61636b2077696e207468"+
                  "65204a756e6520323031352041756775"+
                  "7220427265616b64616e63696e672043"+
                  "6f6d7065746974696f6e3f",
        chunk_len: 32,
        expected: "00000000000000000000000000000000"+
                  "00000000000000000000000000000001"+
                  "00000000000000000000000000000000"+
                  "00000000000000000000000000000002"+
                  "00000000000000000000000000000000"+
                  "000000000000000000000000000000a5"+
                  "00000000000000000000000000000000"+
                  "0000000000000000000000000000003b"+
                  "57696c6c204a61636b2077696e207468"+
                  "65204a756e6520323031352041756775"+
                  "7220427265616b64616e63696e672043"+
                  "6f6d7065746974696f6e3f0000000000"
    });
});

describe("pad_left", function () {
    var test = function (t) {
        it(t.value + "," + t.chunk_len + "," + t.prefix + " -> " + t.expected, function () {
            assert.strictEqual(abi.pad_left(t.value, t.chunk_len, t.prefix), t.expected);
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
    test({
        value:    "0",
        chunk_len: 64,
        expected: "0000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "1",
        chunk_len: 64,
        expected: "0000000000000000000000000000000000000000000000000000000000000001"
    });
    test({
        value:    "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775",
        chunk_len: 64,
        expected: "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"
    });
    test({
        value:    "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e",
        chunk_len: 64,
        expected: "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e"
    });
    test({
        value:    "123456789",
        chunk_len: 64,
        expected: "0000000000000000000000000000000000000000000000000000000123456789"
    });
    test({
        value:    "000000000123456789",
        chunk_len: 64,
        expected: "0000000000000000000000000000000000000000000000000000000123456789"
    });
    test({
        value:    "1234567890000000000000000000000000000000000000000000000000000000"+
                  "1",
        chunk_len: 64,
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
        chunk_len: 64,
        expected: "0000000000000000000000000000000000000000000000000000000000000000"+
                  "0000000001000000000000000000000000000000000000000000000000000000"+
                  "0000000002000000000000000000000000000000000000000000000000000000"+
                  "00000000a5000000000000000000000000000000000000000000000000000000"+
                  "000000003b57696c6c204a61636b2077696e20746865204a756e652032303135"+
                  "20417567757220427265616b64616e63696e6720436f6d7065746974696f6e3f"
    });
    test({
        value:    "0",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "0000000000000000000000000000000000000000000000000000000000000000"
    });
    test({
        value:    "1",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "0000000000000000000000000000000000000000000000000000000000000001"
    });
    test({
        value:    "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"
    });
    test({
        value:    "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "54686520756c74696d61746520736f6c7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e6372797074656420706572736f6e616c20636f6d6d756e"
    });
    test({
        value:    "123456789",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "0000000000000000000000000000000000000000000000000000000123456789"
    });
    test({
        value:    "000000000123456789",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "0000000000000000000000000000000000000000000000000000000123456789"
    });
    test({
        value:    "1234567890000000000000000000000000000000000000000000000000000000"+
                  "1",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "0000000000000000000000000000000000000000000000000000000000000001"+
                  "2345678900000000000000000000000000000000000000000000000000000001"
    });
    test({
        value:    "0000000000000000000000000000000000000000000000000000000000000001"+
                  "0000000000000000000000000000000000000000000000000000000000000002"+
                  "00000000000000000000000000000000000000000000000000000000000000a5"+
                  "000000000000000000000000000000000000000000000000000000000000003b"+
                  "57696c6c204a61636b2077696e20746865204a756e6520323031352041756775"+
                  "7220427265616b64616e63696e6720436f6d7065746974696f6e3f",
        chunk_len: 64,
        prefix: true,
        expected: "0x"+
                  "0000000000000000000000000000000000000000000000000000000000000000"+
                  "0000000001000000000000000000000000000000000000000000000000000000"+
                  "0000000002000000000000000000000000000000000000000000000000000000"+
                  "00000000a5000000000000000000000000000000000000000000000000000000"+
                  "000000003b57696c6c204a61636b2077696e20746865204a756e652032303135"+
                  "20417567757220427265616b64616e63696e6720436f6d7065746974696f6e3f"
    });
    test({
        value:    "0",
        chunk_len: 32,
        expected: "00000000000000000000000000000000"
    });
    test({
        value:    "1",
        chunk_len: 32,
        expected: "00000000000000000000000000000001"
    });
    test({
        value:    "57696c6c204a61636b2077696e207468"+
                  "65204a756e6520323031352041756775",
        chunk_len: 32,
        expected: "57696c6c204a61636b2077696e207468"+
                  "65204a756e6520323031352041756775"
    });
    test({
        value:    "54686520756c74696d61746520736f6c"+
                  "7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e63727970746564"+
                  "20706572736f6e616c20636f6d6d756e",
        chunk_len: 32,
        expected: "54686520756c74696d61746520736f6c"+
                  "7574696f6e20746f20676c6f62616c20"+
                  "746f20656e6420656e63727970746564"+
                  "20706572736f6e616c20636f6d6d756e"
    });
    test({
        value:    "123456789",
        chunk_len: 32,
        expected: "00000000000000000000000123456789"

    });
    test({
        value:    "000000000123456789",
        chunk_len: 32,
        expected: "00000000000000000000000123456789"
    });
    test({
        value:    "12345678900000000000000000000000"+
                  "00000000000000000000000000000000"+
                  "1",
        chunk_len: 32,
        expected: "00000000000000000000000000000001"+
                  "23456789000000000000000000000000"+
                  "00000000000000000000000000000001"
    });
    test({
        value:    "00000000000000000000000000000000"+
                  "00000000000000000000000000000001"+
                  "00000000000000000000000000000000"+
                  "00000000000000000000000000000002"+
                  "00000000000000000000000000000000"+
                  "000000000000000000000000000000a5"+
                  "00000000000000000000000000000000"+
                  "0000000000000000000000000000003b"+
                  "57696c6c204a61636b2077696e207468"+
                  "65204a756e6520323031352041756775"+
                  "7220427265616b64616e63696e672043"+
                  "6f6d7065746974696f6e3f",
        chunk_len: 32,
        expected: "00000000000000000000000000000000"+
                  "00000000000000000000000000000000"+
                  "00000000010000000000000000000000"+
                  "00000000000000000000000000000000"+
                  "00000000020000000000000000000000"+
                  "00000000000000000000000000000000"+
                  "00000000a50000000000000000000000"+
                  "00000000000000000000000000000000"+
                  "000000003b57696c6c204a61636b2077"+
                  "696e20746865204a756e652032303135"+
                  "20417567757220427265616b64616e63"+
                  "696e6720436f6d7065746974696f6e3f"
    });
});

describe("chunk", function () {
    var test = function (t) {
        it(t.total_len + " -> " + t.expected, function () {
            assert.strictEqual(abi.chunk(t.total_len, t.chunk_len), t.expected);
        });
    };
    test({ total_len: 0, expected: 0 });
    test({ total_len: 1, expected: 1 });
    test({ total_len: 32, expected: 1 });
    test({ total_len: 63, expected: 1 });
    test({ total_len: 64, expected: 1 });
    test({ total_len: 65, expected: 2 });
    test({ total_len: 127, expected: 2 });
    test({ total_len: 128, expected: 2 });
    test({ total_len: 160, expected: 3 });
    test({ total_len: 255, expected: 4 });
    test({ total_len: 256, expected: 4 });
    test({ total_len: 0, chunk_len: 64, expected: 0 });
    test({ total_len: 1, chunk_len: 64, expected: 1 });
    test({ total_len: 32, chunk_len: 64, expected: 1 });
    test({ total_len: 63, chunk_len: 64, expected: 1 });
    test({ total_len: 64, chunk_len: 64, expected: 1 });
    test({ total_len: 65, chunk_len: 64, expected: 2 });
    test({ total_len: 127, chunk_len: 64, expected: 2 });
    test({ total_len: 128, chunk_len: 64, expected: 2 });
    test({ total_len: 160, chunk_len: 64, expected: 3 });
    test({ total_len: 255, chunk_len: 64, expected: 4 });
    test({ total_len: 256, chunk_len: 64, expected: 4 });
    test({ total_len: 0, chunk_len: 32, expected: 0 });
    test({ total_len: 1, chunk_len: 32, expected: 1 });
    test({ total_len: 32, chunk_len: 32, expected: 1 });
    test({ total_len: 63, chunk_len: 32, expected: 2 });
    test({ total_len: 64, chunk_len: 32, expected: 2 });
    test({ total_len: 65, chunk_len: 32, expected: 3 });
    test({ total_len: 127, chunk_len: 32, expected: 4 });
    test({ total_len: 128, chunk_len: 32, expected: 4 });
    test({ total_len: 160, chunk_len: 32, expected: 5 });
    test({ total_len: 255, chunk_len: 32, expected: 8 });
    test({ total_len: 256, chunk_len: 32, expected: 8 });
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

describe("encode", function () {
    var test = function (t) {
        it(t.method + "(" + JSON.stringify(t.params) + ":" + t.signature + ") -> " + t.expected, function () {
            var prefix = abi.abi.methodID(t.method, t.signature);
            var encoded = abi.encode(t);
            assert.strictEqual(encoded, t.expected);
        });
    };
    describe("No parameters", function () {
        test({
            method: "ten",
            signature: [],
            expected: "0x643ceff9"
        });
        test({
            method: "faucet",
            signature: [],
            expected: "0xde5f72fd"
        });
        test({
            method: "getBranches",
            signature: [],
            expected: "0xc3387858"
        });
    });
    describe("Single int256 parameter", function () {
        test({
            method: 'getDescription',
            signature: ["int256"],
            params: ['0xe64fcc433c2cd3292766aa5c9af64f6f9c6d73ada01fce0bfba4a9952af16bf7'],
            expected: "0x37e7ee00"+
                "e64fcc433c2cd3292766aa5c9af64f6f9c6d73ada01fce0bfba4a9952af16bf7"
        });
        test({
            method: "double",
            signature: ["int256"],
            params: [3],
            expected: "0x6ffa1caa"+
                "0000000000000000000000000000000000000000000000000000000000000003"
        });
        test({
            method: "getMarkets",
            signature: ["int256"],
            params: [1010101],
            expected: "0xb3903c8a"+
                "00000000000000000000000000000000000000000000000000000000000f69b5"
        });
        test({
            method: "getVotePeriod",
            signature: ["int256"],
            params: [1010101],
            expected: "0x7a66d7ca"+
                "00000000000000000000000000000000000000000000000000000000000f69b5"
        });
        test({
            method: "getDescription",
            signature: ["int256"],
            params: ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"],
            expected: "0x37e7ee00"+
                "b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"
        });
        test({
            method: "getEventInfo",
            signature: ["int256"],
            params: ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"],
            expected: "0x1aecdb5b"+
                "b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"
        });
    });
    describe("Multiple int256 parameters", function () {
        test({
            method: "multiply",
            signature: ["int256", "int256"],
            params: [2, 3],
            expected: "0x3c4308a8"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000003"
        });
        test({
            method: "sendReputation",
            signature: ["int256", "int256", "int256"],
            params: [
                1010101,
                "0x6fc0a64e2dce367e35417bfd1568fa35af9f3e4b",
                abi.fix("5").toFixed()
            ],
            expected: "0xa677135c"+
                "00000000000000000000000000000000000000000000000000000000000f69b5"+
                "0000000000000000000000006fc0a64e2dce367e35417bfd1568fa35af9f3e4b"+
                "0000000000000000000000000000000000000000000000004563918244f40000"
        });
    });
    describe("Single int256[] parameter", function () {
        test({
            method: "double",
            signature: ["int256[]"],
            params: [[3]],
            expected: "0x08de53e9"+
                      "0000000000000000000000000000000000000000000000000000000000000020"+
                      "0000000000000000000000000000000000000000000000000000000000000001"+
                      "0000000000000000000000000000000000000000000000000000000000000003"
        });
        test({
            method: "double",
            signature: ["int256[]"],
            params: [[2, 3]],
            expected: "0x08de53e9"+
                "0000000000000000000000000000000000000000000000000000000000000020"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000003"
        });
        test({
            method: "double",
            signature: ["int256[]"],
            params: [[4, 7]],
            expected: "0x08de53e9"+
                "0000000000000000000000000000000000000000000000000000000000000020"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000004"+
                "0000000000000000000000000000000000000000000000000000000000000007"
        });
        test({
            method: "double",
            signature: ["int256[]"],
            params: [[1, 2, 3]],
            expected: "0x08de53e9"+
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
            signature: ["int256[]", "int256[]"],
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
            signature: ["bytes", "int256", "int256[]"],
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
            method: "testMethod",
            signature: ["bytes", "int256", "int256[]"],
            params: ["☃", 1, [1, 2, 3]],
            expected: "0x542b5456"+
                "0000000000000000000000000000000000000000000000000000000000000060"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "00000000000000000000000000000000000000000000000000000000000000a0"+
                "0000000000000000000000000000000000000000000000000000000000000003"+
                "e298830000000000000000000000000000000000000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000003"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000003" 
        });
        test({
            method: "testMethod",
            signature: ["bytes", "int256", "int256[]"],
            params: ["€", 1, [1, 2, 3]],
            expected: "0x542b5456"+
                "0000000000000000000000000000000000000000000000000000000000000060"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "00000000000000000000000000000000000000000000000000000000000000a0"+
                "0000000000000000000000000000000000000000000000000000000000000003"+
                "e282ac0000000000000000000000000000000000000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000003"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000003"
        });
        test({
            method: "testMethod",
            signature: ["bytes", "int256", "int256[]"],
            params: ["漢字", 1, [1, 2, 3]],
            expected: "0x542b5456"+
                "0000000000000000000000000000000000000000000000000000000000000060"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "00000000000000000000000000000000000000000000000000000000000000a0"+
                "0000000000000000000000000000000000000000000000000000000000000006"+
                "e6bca2e5ad970000000000000000000000000000000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000003"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "0000000000000000000000000000000000000000000000000000000000000002"+
                "0000000000000000000000000000000000000000000000000000000000000003"
        });
        test({
            method: "createMarket",
            signature: ["int256", "bytes", "int256", "int256", "int256", "int256[]"],
            params: [1, "gavofyork", 2, 3, 4, [5, 6, 7]],
            expected: "0x08d19b3f"+
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
            signature: ["int256", "int256", "int256", "int256[]", "int256"],
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
            signature: ["int256", "bytes", "int256", "int256", "int256", "int256"],
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
            signature: ["int256", "bytes", "int256", "int256", "int256", "int256", "int256"],
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
            signature: ["int256", "bytes", "int256", "int256", "int256", "int256", "int256"],
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
                "57696c6c204a61636b2077696e20746865204a756e6520323031352061756775"+
                "7220427265616b64616e63696e6720436f6d7065746974696f6e3f0000000000"
        });
        test({
            method: "createMarket",
            signature: ["int256", "bytes", "int256", "int256", "int256", "int256[]"],
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
            expected: "0x08d19b3f"+
                "38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991"+
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
            method: "createMarket",
            signature: ["int256", "bytes", "int256", "int256", "int256", "int256[]", "int256"],
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
            signature: ["int256", "bytes", "int256", "int256", "int256", "int256[]", "int256"],
            params: [
                "0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991",
                "unicorns are real",
                "0x10000000000000000",
                "0xa0000000000000000",
                "0xa0000000000000000",
                [abi.unfork("-0x2ae31f0184fa3e11a1517a11e3fc6319cb7c310cee36b20f8e0263049b1f3a6f", true)],
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
            signature: ["int256", "bytes", "int256", "int256", "int256", "int256[]", "int256"],
            params: [
                1010101,
                "Will the Sun turn into a red giant and engulf the Earth by the end of 2015?",
                abi.fix("0.0079", "hex"),
                1000,
                abi.fix("0.02", "hex"),
                [abi.unfork("-0x29ccc80fb51d4a6cf0855251cbca882f6afea3a93e12b3722d2401fccddc41f2", true)],
                "10000"
            ],
            expected: "0x8df6a0cc"+
                "00000000000000000000000000000000000000000000000000000000000f69b5"+
                "00000000000000000000000000000000000000000000000000000000000000e0"+
                "000000000000000000000000000000000000000000000000001c110215b9c000"+
                "00000000000000000000000000000000000000000000000000000000000003e8"+
                "00000000000000000000000000000000000000000000000000470de4df820000"+
                "0000000000000000000000000000000000000000000000000000000000000160"+
                "0000000000000000000000000000000000000000000000000000000000002710"+
                "000000000000000000000000000000000000000000000000000000000000004b"+
                "57696c6c207468652053756e207475726e20696e746f20612072656420676961"+
                "6e7420616e6420656e67756c6620746865204561727468206279207468652065"+
                "6e64206f6620323031353f000000000000000000000000000000000000000000"+
                "0000000000000000000000000000000000000000000000000000000000000001"+
                "d63337f04ae2b5930f7aadae343577d095015c56c1ed4c8dd2dbfe033223be0e"
        });
    });
});
