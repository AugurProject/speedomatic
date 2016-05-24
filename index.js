/**
 * Ethereum contract ABI data serialization.
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var keccak_256 = require("js-sha3").keccak_256;
var ethabi = require("ethereumjs-abi");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

module.exports = {

    constants: {
        ONE: (new BigNumber(2)).toPower(64),
        MOD: new BigNumber(2).toPower(256),
        BYTES_32: new BigNumber(2).toPower(252)
    },

    abi: ethabi,

    copy: function (obj) {
        if (null === obj || "object" !== typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    },

    is_numeric: function (n) {
        return Number(parseFloat(n)) == n;
    },

    remove_leading_zeros: function (h) {
        var hex = h.toString();
        if (hex.slice(0, 2) === "0x") {
            hex = hex.slice(2);
        }
        if (!/^0+$/.test(hex)) {
            while (hex.slice(0, 2) === "00") {
                hex = hex.slice(2);
            }
        }
        return hex;
    },

    remove_trailing_zeros: function (h, utf8) {
        var hex = h.toString();
        if (utf8) {
            while (hex.slice(-1) === "\u0000") {
                hex = hex.slice(0, -1);
            }
        } else {
            while (hex.slice(-2) === "00") {
                hex = hex.slice(0, -2);
            }
        }
        return hex;
    },

    bytes_to_utf16: function (bytearray) {
        if (bytearray.constructor === Array) {
            var tmp = '';
            for (var i = 0; i < bytearray.length; ++i) {
                tmp += bytearray[i].slice(2);
            }
            bytearray = tmp;
        } else if (Buffer.isBuffer(bytearray)) {
            bytearray = bytearray.toString("hex");
        }
        bytearray = this.strip_0x(bytearray);
        return this.remove_trailing_zeros(
            this.abi.rawDecode(
                ["string"],
                new Buffer(
                    "0000000000000000000000000000000000000000000000000000000000000020"+
                        this.pad_left((this.chunk(bytearray.length)*32).toString(16))+
                        this.pad_right(bytearray),
                    "hex")
            )[0], true);
    },

    short_string_to_int256: function (s) {
        if (s.length > 32) s = s.slice(0, 32);
        return this.prefix_hex(ethabi.rawEncode(["string"], [s]).slice(64).toString("hex"));
    },

    int256_to_short_string: function (n) {
        return this.bytes_to_utf16(this.remove_trailing_zeros(n));
    },

    decode_hex: function (h, strip) {
        var hex = h.toString();
        var str = '';
        if (hex.slice(0,2) === "0x") hex = hex.slice(2);
        // first 32 bytes = offset
        // second 32 bytes = string length
        if (strip) {
            hex = hex.slice(128);
            hex = this.remove_trailing_zeros(hex);
        }
        for (var i = 0, l = hex.length; i < l; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    },

    // convert bytes to hex
    encode_hex: function (str) {
        var hexbyte, hex = '';
        if (str && str.constructor === Object || str.constructor === Array) {
            str = JSON.stringify(str);
        }
        for (var i = 0, len = str.length; i < len; ++i) {
            hexbyte = str.charCodeAt(i).toString(16);
            if (hexbyte.length === 1) hexbyte = "0" + hexbyte;
            hex += hexbyte;
        }
        return hex;
    },

    unfork: function (forked, prefix) {
        if (forked !== null && forked !== undefined) {
            var unforked = this.bignum(forked);
            var superforked = unforked.plus(this.constants.MOD);
            if (superforked.gte(this.constants.BYTES_32) && superforked.lt(this.constants.MOD)) {
                unforked = superforked;
            }
            if (forked.constructor === BigNumber) return unforked;
            unforked = this.pad_left(unforked.toString(16));
            if (prefix) unforked = this.prefix_hex(unforked);
            return unforked;
        }
    },

    hex: function (n, wrap) {
        var h;
        if (n !== undefined && n !== null && n.constructor) {
            switch (n.constructor) {
                case Buffer:
                    h = n.toString("hex");
                    break;
                case Object:
                    h = this.encode_hex(JSON.stringify(n));
                    break;
                case Array:
                    h = this.bignum(n, "hex", wrap);
                    break;
                case BigNumber:
                    h = n.toString(16);
                    break;
                case String:
                    if (n === "-0x0") {
                        h = "0x0";
                    } else if (n === "-0") {
                        h = "0";
                    } else if (n.slice(0, 3) === "-0x" || n.slice(0, 2) === "-0x") {
                        h = n;
                    } else {
                        if (isFinite(n)) {
                            h = this.bignum(n, "hex", wrap);
                        } else {
                            h = this.encode_hex(n);
                        }
                    }
                    break;
                case Boolean:
                    h = (n) ? "0x1" : "0x0";
                    break;
                default:
                    h = this.bignum(n, "hex", wrap);
            }
        }
        return this.prefix_hex(h);
    },

    is_hex: function (str) {
        if (str && str.constructor === String) {
            if (str.slice(0, 1) === '-' && str.length > 1) {
                return /^[0-9A-F]+$/i.test(str.slice(1));
            }
            return /^[0-9A-F]+$/i.test(str);
        }
        return false;
    },

    format_address: function (addr) {
        if (addr && addr.constructor === String) {
            addr = this.strip_0x(addr);
            while (addr.length > 40 && addr.slice(0, 1) === "0") {
                addr = addr.slice(1);
            }
            while (addr.length < 40) {
                addr = "0" + addr;
            }
            return this.prefix_hex(addr);
        }
    },

    strip_0x: function (str) {
        if (str && str.constructor === String && str.length >= 2) {
            var h = str;
            if (h === "-0x0" || h === "0x0") {
                return "0";
            }
            if (h.slice(0, 2) === "0x" && h.length > 2) {
                h = h.slice(2);
            } else if (h.slice(0, 3) === "-0x" && h.length > 3) {
                h = '-' + h.slice(3);
            }
            if (this.is_hex(h)) return h;
        }
        return str;
    },

    zero_prefix: function (h) {
        if (h !== undefined && h !== null && h.constructor === String) {
            h = this.strip_0x(h);
            if (h.length % 2) h = "0" + h;
            if (h.slice(0,2) !== "0x" && h.slice(0,3) !== "-0x") {
                if (h.slice(0,1) === '-') {
                    h = "-0x" + h.slice(1);
                } else {
                    h = "0x" + h;
                }
            }
        }
        return h;
    },

    prefix_hex: function (n) {
        if (n !== undefined && n !== null) {
            if (n.constructor === Number || n.constructor === BigNumber) {
                n = n.toString(16);
            }
            if (n.constructor === String &&
                n.slice(0,2) !== "0x" && n.slice(0,3) !== "-0x")
            {
                if (n.slice(0,1) === '-') {
                    n = "-0x" + n.slice(1);
                } else {
                    n = "0x" + n;
                }
            }
        }
        return n;
    },

    bignum: function (n, encoding, wrap) {
        var bn, len;
        if (n !== null && n !== undefined && n !== "0x" && !n.error && !n.message) {
            switch (n.constructor) {
                case BigNumber:
                    bn = n;
                    break;
                case Number:
                    if (Math.floor(Math.log(n) / Math.log(10) + 1) <= 15) {
                        bn = new BigNumber(n);
                    } else {
                        n = n.toString();
                        try {
                            bn = new BigNumber(n);
                        } catch (exc) {
                            if (this.is_hex(n)) {
                                bn = new BigNumber(n, 16);
                            } else {
                                return n;
                            }
                        }
                    }
                    break;
                case String:
                    try {
                        bn = new BigNumber(n);
                    } catch (exc) {
                        if (this.is_hex(n)) {
                            bn = new BigNumber(n, 16);
                        } else {
                            return n;
                        }
                    }
                    break;
                case Array:
                    len = n.length;
                    bn = new Array(len);
                    for (var i = 0; i < len; ++i) {
                        bn[i] = this.bignum(n[i], encoding, wrap);
                    }
                    break;
                default:
                    try {
                        bn = new BigNumber(n);
                    } catch (ex) {
                        try {
                            bn = new BigNumber(n, 16);
                        } catch (exc) {
                            return n;
                        }
                    }
            }
            if (bn !== undefined && bn !== null && bn.constructor === BigNumber) {
                if (wrap && bn.gte(this.constants.BYTES_32)) {
                    bn = bn.sub(this.constants.MOD);
                }
                if (encoding) {
                    if (encoding === "number") {
                        bn = bn.toNumber();
                    } else if (encoding === "string") {
                        bn = bn.toFixed();
                    } else if (encoding === "hex") {
                        bn = this.prefix_hex(bn.toString(16));
                    }
                }
            }
            return bn;
        } else {
            return n;
        }
    },

    fix: function (n, encode) {
        var fixed;
        if (n && n !== "0x" && !n.error && !n.message) {
            if (encode && n.constructor === String) {
                encode = encode.toLowerCase();
            }
            if (n.constructor === Array) {
                var len = n.length;
                fixed = new Array(len);
                for (var i = 0; i < len; ++i) {
                    fixed[i] = this.fix(n[i], encode);
                }
            } else {
                if (n.constructor === BigNumber) {
                    fixed = n.mul(this.constants.ONE).round();
                } else {
                    fixed = this.bignum(n).mul(this.constants.ONE).round();
                }
                if (fixed && fixed.gte(this.constants.BYTES_32)) {
                    fixed = fixed.sub(this.constants.MOD);
                }
                if (encode) {
                    if (encode === "string") {
                        fixed = fixed.toFixed();
                    } else if (encode === "hex") {
                        if (fixed.constructor === BigNumber) {
                            fixed = fixed.toString(16);
                        }
                        fixed = this.prefix_hex(fixed);
                    }
                }
            }
            return fixed;
        } else {
            return n;
        }
    },

    unfix: function (n, encode) {
        var unfixed;
        if (n && n !== "0x" && !n.error && !n.message) {
            if (encode) encode = encode.toLowerCase();
            if (n.constructor === Array) {
                var len = n.length;
                unfixed = new Array(len);
                for (var i = 0; i < len; ++i) {
                    unfixed[i] = this.unfix(n[i], encode);
                }
            } else {
                if (n.constructor === BigNumber) {
                    unfixed = n.dividedBy(this.constants.ONE);
                } else {
                    unfixed = this.bignum(n).dividedBy(this.constants.ONE);
                }
                if (unfixed && encode) {
                    if (encode === "hex") {
                        unfixed = this.prefix_hex(unfixed);
                    } else if (encode === "string") {
                        unfixed = unfixed.toFixed();
                    } else if (encode === "number") {
                        unfixed = unfixed.toNumber();
                    }
                }
            }
            return unfixed;
        } else {
            return n;
        }
    },

    string: function (n) {
        return this.bignum(n, "string");
    },

    number: function (s) {
        return this.bignum(s, "number");
    },

    chunk: function (total_len, chunk_len) {
        chunk_len = chunk_len || 64;
        return Math.ceil(total_len / chunk_len);
    },

    pad_right: function (s, chunk_len, prefix) {
        chunk_len = chunk_len || 64;
        s = this.strip_0x(s);
        var multiple = chunk_len * this.chunk(s.length, chunk_len);
        while (s.length < multiple) {
            s += '0';
        }
        if (prefix) s = this.prefix_hex(s);
        return s;
    },

    pad_left: function (s, chunk_len, prefix) {
        chunk_len = chunk_len || 64;
        s = this.strip_0x(s);
        var multiple = chunk_len * this.chunk(s.length, chunk_len);
        while (s.length < multiple) {
            s = '0' + s;
        }
        if (prefix) s = this.prefix_hex(s);
        return s;
    },

    encode_prefix: function (funcname, signature) {
        signature = signature || "";
        var summary = funcname + "(";
        for (var i = 0, len = signature.length; i < len; ++i) {
            switch (signature[i]) {
                case 's':
                    summary += "bytes";
                    break;
                case 'b':
                    summary += "bytes";
                    var j = 1;
                    while (this.is_numeric(signature[i+j])) {
                        summary += signature[i+j].toString();
                        j++;
                    }
                    i += j;
                    break;
                case 'i':
                    summary += "int256";
                    break;
                case 'a':
                    summary += "int256[]";
                    break;
                default:
                    summary += "weird";
            }
            if (i !== len - 1) summary += ",";
        }
        var prefix = keccak_256(summary + ")").slice(0, 8);
        while (prefix.slice(0, 1) === '0') {
            prefix = prefix.slice(1);
        }
        return this.pad_left(prefix, 8, true);
    },

    parse_signature: function (signature) {
        var types = [];
        for (var i = 0, len = signature.length; i < len; ++i) {
            if (this.is_numeric(signature[i])) {
                types[types.length - 1] += signature[i].toString();
            } else {
                if (signature[i] === 's') {
                    types.push("bytes");
                } else if (signature[i] === 'b') {
                    types.push("bytes");
                } else if (signature[i] === 'a') {
                    types.push("int256[]");
                } else {
                    types.push("int256");
                }
            }
        }
        return types;
    },

    parse_params: function (params) {
        if (params !== undefined && params !== null &&
            params !== [] && params !== "")
        {
            if (params.constructor === String) {
                if (params.slice(0,1) === "[" &&
                    params.slice(-1) === "]")
                {
                    params = JSON.parse(params);
                }
                if (params.constructor === String) {
                    params = [params];
                }
            } else if (params.constructor === Number) {
                params = [params];
            }
        } else {
            params = [];
        }
        return params;
    },

    encode_int: function (value) {
        var cs, x, output;
        cs = [];
        x = new BigNumber(value);
        while (x.gt(new BigNumber(0))) {
            cs.push(String.fromCharCode(x.mod(new BigNumber(256))));
            x = x.dividedBy(new BigNumber(256)).floor();
        }
        output = this.encode_hex((cs.reverse()).join(''));
        while (output.length < 64) {
            output = '0' + output;
        }
        return output;
    },

    // hex-encode a function's ABI data and return it
    encode: function (tx) {
        tx.signature = tx.signature || "";
        return this.encode_prefix(tx.method, tx.signature) + ethabi.rawEncode(ethabi.fromSerpent(tx.signature), tx.params).toString("hex");
    }
};
