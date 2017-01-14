/**
 * Ethereum contract ABI data serialization.
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var keccak_256 = require("js-sha3").keccak_256;
var ethabi = require("ethereumjs-abi");

BigNumber.config({
  MODULO_MODE: BigNumber.EUCLID,
  ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

module.exports = {

  debug: false,

  version: "1.1.1",

  constants: {
    ONE: new BigNumber(10).toPower(new BigNumber(18)),
    BYTES_32: new BigNumber(2).toPower(new BigNumber(252)),
    // Serpent integers are bounded by [-2^255, 2^255-1]
    SERPINT_MIN: new BigNumber(2).toPower(new BigNumber(255)).neg(),
    SERPINT_MAX: new BigNumber(2).toPower(new BigNumber(255)).minus(new BigNumber(1)),
    MOD: new BigNumber(2).toPower(new BigNumber(256))
  },

  abi: ethabi,

  keccak_256: keccak_256,

  // Convert hex to byte array for sha3
  // (https://github.com/ethereum/dapp-bin/blob/master/ether_ad/scripts/sha3.min.js)
  hex_to_bytes: function (s) {
    var o = [];
    var alpha = "0123456789abcdef";
    for (var i = (s.substr(0, 2) === "0x" ? 2 : 0); i < s.length; i += 2) {
      var index1 = alpha.indexOf(s[i]);
      var index2 = alpha.indexOf(s[i + 1]);
      if (index1 < 0 || index2 < 0) {
        throw("Bad input to hex decoding: " + s + " " + i + " " + index1 + " " + index2);
      }
      o.push(16*index1 + index2);
    }
    return o;
  },

  bytes_to_hex: function (b) {
    var hexbyte, h = "";
    for (var i = 0, n = b.length; i < n; ++i) {
      hexbyte = this.strip_0x(b[i].toString(16));
      if (hexbyte.length === 1) hexbyte = "0" + hexbyte;
      h += hexbyte;
    }
    return h;
  },

  sha3: function (hexstr) {
    return keccak_256(this.hex_to_bytes(hexstr));
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
    var el, bytestring;
    if (Buffer.isBuffer(bytearray)) {
      return new Buffer(bytearray, "hex").toString("utf8");
    }
    if (bytearray.constructor === Array) {
      bytestring = '';
      for (var i = 0, numBytes = bytearray.length; i < numBytes; ++i) {
        el = bytearray[i];
        if (el !== undefined && el !== null) {
          if (el.constructor === String) {
            el = this.strip_0x(el);
            if (el.length % 2 !== 0) el = '0' + el;
            bytestring += el;
          } else if (el.constructor === Number || el.constructor === BigNumber) {
            el = el.toString(16);
            if (el.length % 2 !== 0) el = '0' + el;
            bytestring += el;
          } else if (Buffer.isBuffer(el)) {
            bytestring += el.toString("hex");
          }
        }
      }
    }
    if (bytearray.constructor === String) {
      bytestring = this.strip_0x(bytearray);
    } else if (bytearray.constructor === Number || bytearray.constructor === BigNumber) {
      bytestring = bytearray.toString(16);
    }
    try {
      bytestring = new Buffer(bytestring, "hex");
    } catch (ex) {
      console.error("[augur-abi] bytes_to_utf16:", JSON.stringify(bytestring, null, 2));
      throw ex;
    }
    return bytestring.toString("utf8");
  },

  short_string_to_int256: function (shortstring) {
    var int256 = shortstring;
    if (int256.length > 32) int256 = int256.slice(0, 32);
    return this.prefix_hex(this.pad_right(new Buffer(int256, "utf8").toString("hex")));
  },

  int256_to_short_string: function (int256) {
    return new Buffer(this.strip_0x(this.remove_trailing_zeros(int256)), "hex").toString("utf8");
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
  encode_hex: function (str, toArray) {
    var hexbyte, hex, i, len;
    if (str && str.constructor === Object || str.constructor === Array) {
      str = JSON.stringify(str);
    }
    len = str.length;
    if (toArray) {
      hex = [];
      for (i = 0; i < len; ++i) {
        hexbyte = str.charCodeAt(i).toString(16);
        if (hexbyte.length === 1) hexbyte = "0" + hexbyte;
        hex.push(this.prefix_hex(hexbyte));
      }
    } else {
      hex = '';
      for (i = 0; i < len; ++i) {
        hexbyte = str.charCodeAt(i).toString(16);
        if (hexbyte.length === 1) hexbyte = "0" + hexbyte;
        hex += hexbyte;
      }
    }
    return hex;
  },

  raw_encode_hex: function (str) {
    return ethabi.rawEncode(["string"], [str]).toString("hex");
  },

  raw_decode_hex: function (hex) {
    if (!Buffer.isBuffer(hex)) hex = new Buffer(this.strip_0x(hex), "hex");
    return ethabi.rawDecode(["string"], hex)[0];
  },

  unfork: function (forked, prefix) {
    if (forked !== null && forked !== undefined && forked.constructor !== Object) {
      var unforked = this.bignum(forked);
      if (unforked.constructor === BigNumber) {
        var superforked = unforked.plus(this.constants.MOD);
        if (superforked.gte(this.constants.BYTES_32) && superforked.lt(this.constants.MOD)) {
          unforked = superforked;
        }
        if (forked.constructor === BigNumber) return unforked;
        unforked = this.pad_left(unforked.toString(16));
        if (prefix) unforked = this.prefix_hex(unforked);
        return unforked;
      } else {
        throw new Error("abi.unfork failed (bad input): " + JSON.stringify(forked));
      }
    } else {
      throw new Error("abi.unfork failed (bad input): " + JSON.stringify(forked));
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
          if (wrap) {
            h = this.wrap(n.floor()).toString(16);
          } else {
            h = n.floor().toString(16);
          }
          break;
        case String:
          if (n === "-0x0") {
            h = "0x0";
          } else if (n === "-0") {
            h = "0";
          } else if (n.slice(0, 3) === "-0x" || n.slice(0, 2) === "-0x") {
            h = this.bignum(n, "hex", wrap);
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

  format_int256: function (s) {
    if (s === undefined || s === null || s === "0x") return s;
    if (Buffer.isBuffer(s)) s = s.toString("hex");
    if (s.constructor !== String) s = s.toString(16);
    if (s.slice(0, 1) === "-") s = this.unfork(s);
    s = this.strip_0x(s);
    if (s.length > 64) {
      if (this.debug) {
        var overflow = (s.length / 2) - 32;
        console.warn("input " + overflow + " bytes too large for int256, truncating");
      }
      s = s.slice(0, 64);
    }
    return this.prefix_hex(this.pad_left(s));
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
    if (n === undefined || n === null || n === "") return n;
    if (n.constructor === Number || n.constructor === BigNumber) {
      n = n.toString(16);
    }
    if (n.constructor === String && n.slice(0,2) !== "0x" && n.slice(0,3) !== "-0x") {
      if (n.slice(0,1) === '-') {
        n = "-0x" + n.slice(1);
      } else {
        n = "0x" + n;
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
          bn = new BigNumber(n, 10);
          break;
        case String:
          try {
            bn = new BigNumber(n, 10);
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
          if (this.is_hex(n)) {
            bn = new BigNumber(n, 16);
          } else {
            bn = new BigNumber(n, 10);
          }
      }
      if (bn !== undefined && bn !== null && bn.constructor === BigNumber) {
        if (wrap) bn = this.wrap(bn);
        if (encoding) {
          if (encoding === "number") {
            bn = bn.toNumber();
          } else if (encoding === "string") {
            bn = bn.toFixed();
          } else if (encoding === "hex") {
            bn = this.prefix_hex(bn.floor().toString(16));
          }
        }
      }
      return bn;
    } else {
      return n;
    }
  },

  wrap: function (bn) {
    if (bn === undefined || bn === null) return bn;
    if (bn.constructor !== BigNumber) bn = this.bignum(bn);
    if (bn.gt(this.constants.SERPINT_MAX)) {
      return bn.sub(this.constants.MOD);
    } else if (bn.lt(this.constants.SERPINT_MIN)) {
      return bn.plus(this.constants.MOD);
    }
    return bn;
  },

  fix: function (n, encode, wrap) {
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
        if (wrap) fixed = this.wrap(fixed);
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
            unfixed = this.prefix_hex(unfixed.round());
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

  unfix_signed: function (n, encode) {
    return this.unfix(this.hex(n, true), encode);
  },

  string: function (n, wrap) {
    return this.bignum(n, "string", wrap);
  },

  number: function (s, wrap) {
    return this.bignum(s, "number", wrap);
  },

  chunk: function (total_len, chunk_len) {
    chunk_len = chunk_len || 64;
    return Math.ceil(total_len / chunk_len);
  },

  pad_right: function (s, chunk_len, prefix) {
    chunk_len = chunk_len || 64;
    s = this.strip_0x(s);
    var multiple = chunk_len * (this.chunk(s.length, chunk_len) || 1);
    while (s.length < multiple) {
      s += '0';
    }
    if (prefix) s = this.prefix_hex(s);
    return s;
  },

  pad_left: function (s, chunk_len, prefix) {
    chunk_len = chunk_len || 64;
    s = this.strip_0x(s);
    var multiple = chunk_len * (this.chunk(s.length, chunk_len) || 1);
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
    if (params !== undefined && params !== null && params !== [] && params !== "") {
      if (params.constructor === String) {
        if (params.slice(0,1) === "[" && params.slice(-1) === "]") {
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
    tx.signature = tx.signature || [];
    return this.prefix_hex(Buffer.concat([
      ethabi.methodID(tx.method, tx.signature),
      ethabi.rawEncode(tx.signature, tx.params)
    ]).toString("hex"));
  }
};
