import RateLimiter from './rateLimiter.js'

export class TokenBucketLimiter extends RateLimiter {
  constructor ({ bucketSize, tokensPerInterval, interval, stopped = false }) {
    super({ tokensPerInterval, interval, stopped })
    this.bucketSize = bucketSize
    this.tokens = stopped ? 0 : this.bucketSize
    this.tokensRemovedAt = stopped ? [0] : [Date.now()]
  }

  dripTokens() {
    if (this._isStopped) {
      return
    }

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

    if (this._isStopped) {
      return undefined
    }

    return Math.ceil(tokensNeeded * (this.interval / this.tokensPerInterval))
  }

  reset() {
    this._isStopped = false
    this.tokens = this.bucketSize
    this.tokensRemovedAt = [Date.now()]
    super.reset()
  }
}
