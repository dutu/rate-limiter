import RateLimiter from './rateLimiter.js'

export class RollingWindowLimiter extends RateLimiter {
  constructor ({ tokensPerInterval, interval, stopped = false }) {
    super({ tokensPerInterval, interval, stopped })
    this.tokens = this.tokensPerInterval
  }

  dripTokens() {
    if (this._isStopped) {
      return
    }

    const now = Date.now()
    while (this.tokensRemovedAt.length > 0) {
      if (this.tokensRemovedAt[0][0] + this.interval > now) {
        break
      }

      this.tokens += this.tokensRemovedAt[0][1]
      this.tokensRemovedAt.shift()
    }

    if (this.tokens > this.tokensPerInterval) {
      this.tokens = this.tokensPerInterval
    }

    return this.tokens
  }

  getDelayForTokens(count = 1) {
    if (count > this.tokensPerInterval) {
      throw new Error(`Cannot supply ${count} tokens at once (max is tokensPerInterval = ${this.tokensPerInterval}`)
    }

    this.dripTokens()
    let tokensNeeded = count - this.tokens
    if (tokensNeeded <= 0) {
      return 0
    }

    if (this._isStopped) {
      return undefined
    }

    const now  = Date.now()
    for (const newTokens of this.tokensRemovedAt) {
      tokensNeeded -= newTokens[1]
      if (tokensNeeded <= 0) {
        const delayMs = newTokens[0] + this.interval - now
        return delayMs
      }
    }
  }

  reset() {
    this._isStopped = false
    this.tokensRemovedAt = []
    this.tokens = this.tokensPerInterval
    super.reset()
  }
}
