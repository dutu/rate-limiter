import chai from 'chai'
const expect = chai.expect

import { TokenBucketLimiter } from '../src'


const delay =  (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms))

describe("Constructor", function () {
  it('should create a new instance', function () {
    const limiter = new TokenBucketLimiter({ bucketSize: 10, tokensPerInterval: 1, interval: 'second' })
    expect(limiter).to.be.an.instanceOf(TokenBucketLimiter)
  })
})

describe("getTokens()", function () {
  it('should return correct number of tokens', function () {
    const limiter = new TokenBucketLimiter({ bucketSize: 10, tokensPerInterval: 1, interval: 'second' })
    expect(limiter.getTokens()).to.be.equal(10)
  })
})

describe("tryRemoveTokens()", function () {
  it('should remove correct number of tokens', async function () {
    const limiter = new TokenBucketLimiter({ bucketSize: 10, tokensPerInterval: 2, interval: 'second' })
    let removedTokens = limiter.tryRemoveTokens(8)
    expect(removedTokens).to.be.equal(true)
    expect(limiter.getTokens()).to.be.equal(2)

    await delay(  900)
    expect(limiter.getTokens()).to.be.equal(3)

    await delay(  100)
    expect(limiter.getTokens()).to.be.equal(4)
    removedTokens = limiter.tryRemoveTokens(20)
    expect(removedTokens).to.be.equal(false)
    expect(limiter.getTokens()).to.be.equal(4)

    await delay(2000 - 100)
    expect(limiter.getTokens()).to.be.equal(7)

    await delay(100)
    expect(limiter.getTokens()).to.be.equal(8)

    removedTokens = limiter.tryRemoveTokens(0)
    expect(removedTokens).to.be.equal(true)
    expect(limiter.getTokens()).to.be.equal(8)
  })
})

describe("awaitTokens()", function () {
  it('should await right number of tokens', async function () {
    const limiter = new TokenBucketLimiter({ bucketSize: 10, tokensPerInterval: 3, interval: 'second' })
    let removedTokens = limiter.tryRemoveTokens(4)
    expect(removedTokens).to.be.equal(true)
    expect(limiter.getTokens()).to.be.equal(6)

    let tokens = await limiter.awaitTokens(2)
    expect(limiter.getTokens()).to.be.equal(6)
    expect(tokens).to.be.equal(6)


    tokens = await limiter.awaitTokens(9)
    expect(limiter.getTokens()).to.be.equal(9)
    expect(tokens).to.be.equal(9)
  })
})

