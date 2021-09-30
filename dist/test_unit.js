"use strict";

var chai = require('chai');

var RollingWindowLimiter = require('../index.js').RollingWindowLimiter;

var expect = chai.expect;
describe("Constructor", function () {
  it('should create a new instance', function () {
    var limiter = new RollingWindowLimiter({
      tokensPerInterval: 10,
      interval: 10 * 1000
    });
    expect(limiter).to.be.an.instanceOf(RollingWindowLimiter);
  });
});
//# sourceMappingURL=test_unit.js.map