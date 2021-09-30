import RateLimiter from './rateLimiter'

export default class FixedWindowLimiter extends RateLimiter {
  constructor({tokensPerInterval, interval}) {
    super({tokensPerInterval, interval})
    this.nextDripAt = 0
  }

  dripTokens() {
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

    return this.nextDripAt - Date.now()
  }
}
