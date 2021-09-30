import RateLimiter from './rateLimiter'

export default class TokenBucketLimiter extends RateLimiter {
  constructor ({ bucketSize, tokensPerInterval, interval }) {
    super({ tokensPerInterval, interval })

    this.bucketSize = bucketSize

    // we start with the bucket full
    this.tokens = this.bucketSize

    // last drip
    this.tokensRemovedAt = [Date.now()]

  }

  dripTokens() {
    const now = Date.now()
    const lastDrip = this.tokensRemovedAt[0]
    let deltaMs = Math.max(now - lastDrip, 0)
    this.tokensRemovedAt = [now]
    const tokensToAdd = deltaMs * (this.tokensPerInterval / this.interval)
    this.tokens = Math.min(this.tokens + tokensToAdd, this.bucketSize)
    return Math.floor(this.tokens)
  }

  getDelayForTokens(count = 1) {
    if (count > this.bucketSize) {
      throw new Error(`Cannot supply ${count} tokens at once (max is bucketSize = ${this.bucketSize}`)
    }

    this.dripTokens()
    let tokensNeeded = count - this.tokens
    if (tokensNeeded <= 0) {
      return 0
    }

    return Math.ceil(tokensNeeded * (this.interval / this.tokensPerInterval))
  }
}
