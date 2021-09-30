import chai from 'chai'
const expect = chai.expect

import { RollingWindowLimiter } from '../index.mjs'

const delay =  (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms))

describe("Constructor", function () {
  it('should create a new instance', function () {
    const limiter = new RollingWindowLimiter({ tokensPerInterval: 10, interval: 10 * 1000 })
    expect(limiter).to.be.an.instanceOf(RollingWindowLimiter)
  })
})

describe("getTokens()", function () {
  it('should return correct number of tokens', function () {
    const limiter = new RollingWindowLimiter({tokensPerInterval: 10, interval: 10 * 1000 })
    expect(limiter.getTokens()).to.be.equal(10)
  })
})

describe("tryRemoveTokens()", function () {
  it('should remove correct number of tokens', function () {
    const limiter = new RollingWindowLimiter({tokensPerInterval: 10, interval: 10 * 1000 })
    let removedTokens = limiter.tryRemoveTokens(2)
    expect(removedTokens).to.be.equal(true)
    expect(limiter.getTokens()).to.be.equal(8)

    removedTokens = limiter.tryRemoveTokens(20)
    expect(removedTokens).to.be.equal(false)
    expect(limiter.getTokens()).to.be.equal(8)

    removedTokens = limiter.tryRemoveTokens(0)
    expect(removedTokens).to.be.equal(true)
    expect(limiter.getTokens()).to.be.equal(8)
  })
})

describe("awaitTokens()", function () {
  it('should await right number of tokens', async function () {
    const limiter = new RollingWindowLimiter({tokensPerInterval: 10, interval: 1000 })
    let removedTokens = limiter.tryRemoveTokens(2)
    expect(removedTokens).to.be.equal(true)
    expect(limiter.getTokens()).to.be.equal(8)

    await delay(100)
    removedTokens = limiter.tryRemoveTokens(8)
    expect(removedTokens).to.be.equal(true)
    expect(limiter.getTokens()).to.be.equal(0)

    await delay(800)
    expect(limiter.getTokens()).to.be.equal(0)

    let tokens = await limiter.awaitTokens(2)
    expect(limiter.getTokens()).to.be.equal(2)
    expect(tokens).to.be.equal(2)


    tokens = await limiter.awaitTokens(8)
    expect(limiter.getTokens()).to.be.equal(10)
    expect(tokens).to.be.equal(10)
  })
})

