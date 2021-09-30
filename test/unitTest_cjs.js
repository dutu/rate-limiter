import chai from 'chai'
const expect = chai.expect

const RollingWindowLimiter = require('../dist/index').RollingWindowLimiter

const delay =  (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms))

describe("Constructor", function () {
  it('should create a new instance', function () {
    const limiter = new RollingWindowLimiter({ tokensPerInterval: 10, interval: 10 * 1000 })
    expect(limiter).to.be.an.instanceOf(RollingWindowLimiter)
  })
})
