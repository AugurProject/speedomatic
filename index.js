/**
 * Ethereum contract ABI data serialization.
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var keccak_256 = require("js-sha3").keccak_256;

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = {

    constants: {
        ONE: (new BigNumber(2)).toPower(64),
        MOD: new BigNumber(2).toPower(256),
        BYTES_32: new BigNumber(2).toPower(252)
    },

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

    remove_trailing_zeros: function (h) {
        var hex = h.toString();
        while (hex.slice(-2) === "00") {
            hex = hex.slice(0,-2);
        }
        return hex;
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

    hex: function (n, nowrap) {
        var h;
        if (n !== undefined && n !== null && n.constructor) {
            switch (n.constructor) {
                case Object:
                    h = this.encode_hex(JSON.stringify(n));
                    break;
                case Array:
                    h = this.bignum(n, "hex");
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
                            h = this.bignum(n, "hex", nowrap);
                        } else {
                            h = this.encode_hex(n);
                        }
                    }
                    break;
                case Boolean:
                    h = (n) ? "0x1" : "0x0";
                    break;
                default:
                    h = this.bignum(n, "hex");
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
        var h = str;
        if (h === "-0x0" || h === "0x0") {
            return "0";
        }
        if (h.slice(0, 2) === "0x" && h.length > 2) {
            h = h.slice(2);
        } else if (h.slice(0, 3) === "-0x" && h.length > 3) {
            h = '-' + h.slice(3);
        }
        if (this.is_hex(h)) {
            return h;
        } else {
            return str;
        }
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

    bignum: function (n, encoding, nowrap) {
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
                                // console.log("Couldn't convert Number", n.toString(), "to BigNumber");
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
                            // console.log("Couldn't convert String", n.toString(), "to BigNumber");
                            return n;
                        }
                    }
                    break;
                case Array:
                    len = n.length;
                    bn = new Array(len);
                    for (var i = 0; i < len; ++i) {
                        bn[i] = this.bignum(n[i], encoding, nowrap);
                    }
                    break;
                default:
                    try {
                        bn = new BigNumber(n);
                    } catch (ex) {
                        try {
                            bn = new BigNumber(n, 16);
                        } catch (exc) {
                            // console.log("Couldn't convert", n.toString(), "to BigNumber");
                            return n;
                        }
                    }
            }
            if (bn !== undefined && bn !== null && bn.constructor === BigNumber) {
                if (!nowrap && bn.gte(this.constants.BYTES_32)) {
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

    chunk: function (len) {
        return Math.ceil(len / 64);
    },

    pad_right: function (s) {
        var multipleOf64 = 64 * this.chunk(s.length);
        while (s.length < multipleOf64) {
            s += '0';
        }
        return s;
    },

    pad_left: function (s) {
        var multipleOf64 = 64 * this.chunk(s.length);
        while (s.length < multipleOf64) {
            s = '0' + s;
        }
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
        return "0x" + prefix;
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

    // static parameter encoding

    encode_int256: function (encoding, param) {
        if (param !== undefined && param !== null && param !== [] && param !== "") {

            // input is a javascript number
            if (param.constructor === Number) {
                param = this.bignum(param);
                if (param.lt(new BigNumber(0))) {
                    param = param.add(this.constants.MOD);
                }
                encoding.statics += this.encode_int(param);

            // input is a string
            } else if (param.constructor === String) {

                // negative hex
                if (param.slice(0,1) === '-') {
                    param = this.bignum(param).add(this.constants.MOD).toFixed();
                    encoding.statics += this.encode_int(param);

                // positive hex
                } else if (param.slice(0,2) === "0x") {
                    encoding.statics += this.pad_left(param.slice(2));

                // decimal (base-10 integer)
                } else {
                    encoding.statics += this.encode_int(param);
                }
            }

            // size in multiples of 32
            encoding.chunks += this.chunk(encoding.statics.length);
        }
        return encoding;
    },

    encode_bytesN: function (encoding, param) {
        if (param !== undefined && param !== null && param !== [] && param !== "") {
            while (param.length) {
                encoding.statics += this.pad_right(this.encode_hex(param.slice(0, 64)));
                param = param.slice(64);
            }
            encoding.chunks += this.chunk(encoding.statics.length);
        }
        return encoding;
    },

    // dynamic parameter encoding

    // offset (in multiples of 32)
    offset: function (len, num_params) {
        return this.encode_int(32 * (num_params + this.chunk(len)));
    },

    encode_bytes: function (encoding, param, num_params) {
        encoding.statics += this.offset(encoding.dynamics.length, num_params);
        encoding.dynamics += this.encode_int(param.length);
        encoding.dynamics += this.pad_right(this.encode_hex(param));
        return encoding;
    },

    encode_int256a: function (encoding, param, num_params) {
        encoding.statics += this.offset(encoding.dynamics.length, num_params);
        var arraylen = param.length;
        encoding.dynamics += this.encode_int(arraylen);
        for (var j = 0; j < arraylen; ++j) {
            if (param[j] !== undefined) {
                if (param[j].constructor === Number) {
                    encoding.dynamics += this.encode_int(this.bignum(param[j]).mod(this.constants.MOD).toFixed());
                } else if (param[j].constructor === String) {
                    if (param[j].slice(0,1) === '-') {
                        encoding.dynamics += this.encode_int(this.bignum(param[j]).mod(this.constants.MOD).toFixed());
                    } else if (param[j].slice(0,2) === "0x") {
                        encoding.dynamics += this.pad_left(param[j].slice(2));
                    } else {
                        encoding.dynamics += this.encode_int(this.bignum(param[j]).mod(this.constants.MOD).toFixed());
                    }
                }
                encoding.dynamics = this.pad_right(encoding.dynamics);
            }
        }
        return encoding;
    },

    encode_data: function (itx) {
        var tx, num_params, types, encoding;
        tx = this.copy(itx);
        
        // parse signature and parameter array
        types = this.parse_signature(tx.signature);
        num_params = tx.signature.replace(/\d+/g, '').length;
        tx.params = this.parse_params(tx.params);

        // chunks: size of the static encoding (in multiples of 32)
        encoding = { chunks: 0, statics: '', dynamics: '' };

        // encode parameters
        if (num_params === tx.params.length) {
            for (var i = 0; i < num_params; ++i) {
                if (types[i] === "int256") {
                    encoding = this.encode_int256(encoding, tx.params[i]);
                } else if (types[i] === "bytes" || types[i] === "string") {
                    encoding = this.encode_bytes(encoding, tx.params[i], num_params);
                } else if (types[i] === "int256[]") {
                    encoding = this.encode_int256a(encoding, tx.params[i], num_params);
                } else {
                    // var num_bytes = parseInt(types[i].replace("bytes", ''));
                    encoding = this.encode_bytesN(encoding, tx.params[i]);
                }
            }
            return encoding.statics + encoding.dynamics;

        // number of parameters provided didn't match the signature
        } else {
            return new Error("wrong number of parameters");
        }
    },

    // hex-encode a function's ABI data and return it
    encode: function (tx) {
        tx.signature = tx.signature || "";
        return this.encode_prefix(tx.method, tx.signature) + this.encode_data(tx);
    }
};
