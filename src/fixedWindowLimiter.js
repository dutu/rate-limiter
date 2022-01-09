import RateLimiter from './rateLimiter.js'

export class FixedWindowLimiter extends RateLimiter {
  constructor({ tokensPerInterval, interval, stopped = false }) {
    super({ tokensPerInterval, interval, stopped })
    this.nextDripAt = 0
  }

  dripTokens() {
    if (this._isStopped) {
      return
    }

    this.tokensRemovedAt = []
    if (Date.now() >= this.nextDripAt) {
      this.tokens = this.tokensPerInterval
      this.nextDripAt = Date.now() + this.interval
    }

    return this.tokens
  }

  getDelayForTokens(count = 1) {
    if (count > this.tokensPerInterval) {
      throw new Error(`Cannot supply ${count} tokens at once (max is tokensPerInterval = ${this.tokensPerInterval}`)
    }

    this.dripTokens()
    if (count <= this.tokens) {
      return 0
    }

    if (this._isStopped) {
      return undefined
    }

    return this.nextDripAt - Date.now()
  }

  reset() {
    this._isStopped = false
    this.nextDripAt = 0
    this.dripTokens()
    super.reset()
  }
}
