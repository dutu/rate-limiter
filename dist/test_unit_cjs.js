"use strict";

var _chai = _interopRequireDefault(require("chai"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var expect = _chai["default"].expect;

var RollingWindowLimiter = require('../index.js').RollingWindowLimiter;

var delay = function delay(ms) {
  return new Promise(function (resolve) {
    return setTimeout(function () {
      return resolve();
    }, ms);
  });
};

describe("Constructor", function () {
  it('should create a new instance', function () {
    var limiter = new RollingWindowLimiter({
      tokensPerInterval: 10,
      interval: 10 * 1000
    });
    expect(limiter).to.be.an.instanceOf(RollingWindowLimiter);
  });
});
//# sourceMappingURL=test_unit_cjs.js.map