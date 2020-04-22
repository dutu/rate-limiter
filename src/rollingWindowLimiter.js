import Limiter from './limiter'

export default class RollingWindowLimiter extends Limiter {
  constructor ({ tokensPerInterval, interval }) {
    super({ tokensPerInterval, interval })
  }

  dripTokens() {
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
  }

  getDelayForTokens(count = 1) {
    this.dripTokens()
    let tokensNeeded = count - this.tokens
    const now  = Date.now()

    for (const newTokens of this.tokensRemovedAt) {
      tokensNeeded -= newTokens[1]
      if (tokensNeeded <= 0) {
        const delayMs = newTokens[0] + this.interval - now
        return delayMs
      }
    }

  }
}
