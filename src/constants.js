"use strict";

var BigNumber = require("bignumber.js");

var TWO = new BigNumber(2, 10);

module.exports = {
  FXP_ONE: new BigNumber(10, 10).toPower(new BigNumber(18, 10)),
  BYTES_32: TWO.toPower(new BigNumber(252, 10)),
  INT256_MIN_VALUE: TWO.toPower(new BigNumber(255, 10)).neg(),
  INT256_MAX_VALUE: TWO.toPower(new BigNumber(255, 10)).minus(new BigNumber(1, 10)),
  UINT256_MAX_VALUE: TWO.toPower(new BigNumber(256, 10))
};
