"use strict";

var BigNumber = require("bignumber.js");

var ONE = new BigNumber(1, 10);
var TWO = new BigNumber(2, 10);

module.exports = {
  FXP_ONE: new BigNumber(10, 10).exponentiatedBy(18),
  BYTES_32: TWO.exponentiatedBy(252),
  INT256_MIN_VALUE: TWO.exponentiatedBy(255).negated(),
  INT256_MAX_VALUE: TWO.exponentiatedBy(255).minus(ONE),
  UINT256_MAX_VALUE: TWO.exponentiatedBy(256)
};
