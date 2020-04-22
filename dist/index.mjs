export default class RollingRateLimiter {
  constructor ({ tokensPerInterval, interval }) {
    this.tokensPerInterval = tokensPerInterval
    if (typeof interval === 'string') {
      switch (interval) {
        case 'sec':
        case 'second': {
          this.interval = 1000
          break
        }

        case 'min':
        case 'minute': {
          this.interval = 1000 * 60
          break

        }

        case 'hr':
        case 'hour': {
          this.interval = 1000 * 60 * 60
          break
        }

        case 'day':
        {
          this.interval = 1000 * 60 * 60 * 24
          break
        }

        default:
          throw new Error('Invalid interval ' + interval);
      }
    } else {
      this.interval = interval
    }

    this.tokens = this.interval
    this.tokensRemovedAt = []
  }

  getTokens() {
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


  tryRemoveTokens(count) {
    if (count > this.tokensPerInterval) return false

    this.getTokens()

    if (count > this.tokens) return false

    this.tokens -= count
    this.tokensRemovedAt.push([Date.now(), count])
    return true
  }


  async awaitTokens(count = 1) {
    if (count > this.tokensPerInterval) {
      throw new Error(`Cannot supply ${count} tokens`)
    }

    let tokens = this.getTokens()
    let tokensNeeded = count - tokens

    if(tokensNeeded <= 0) {
      return tokens
    }

    const now  = Date.now()
    let delay
    for (const newTokens of this.tokensRemovedAt) {
      tokensNeeded -= newTokens[1]
      if (tokensNeeded <= 0) {
        const delayMs = newTokens[0] + this.interval - now
        delay =  new Promise((resolve) => setTimeout(() => resolve(), delayMs))
        break
      }
    }

    await delay
    return this.getTokens()
  }
}
