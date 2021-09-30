const chai = require('chai')
const RollingWindowLimiter = require('../index.js').RollingWindowLimiter

const expect = chai.expect

describe("Constructor", function () {
  it('should create a new instance', function () {
    const limiter = new RollingWindowLimiter({ tokensPerInterval: 10, interval: 10 * 1000 })
    expect(limiter).to.be.an.instanceOf(RollingWindowLimiter)
  })
})
