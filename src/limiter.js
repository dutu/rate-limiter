export default class Limiter {
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

  dripTokens() {
  }

  getDelayForTokens(count = 1) {
  }

  getTokens() {
    this.dripTokens()
    return this.tokens
  }

  tryRemoveTokens(count) {
    if (count > this.tokensPerInterval) return false
    this.dripTokens()
    if (count > this.tokens) return false
    this.tokens -= count
    this.tokensRemovedAt.push([Date.now(), count])
    return true
  }

  async awaitTokens(count = 1) {
    if (count > this.tokensPerInterval) {
      throw new Error(`Cannot supply ${count} tokens`)
    }

    this.dripTokens()

    if(count <= this.tokens) {
      return this.tokens
    }

    let delayMs = this.getDelayForTokens(count)
    await new Promise((resolve) => setTimeout(() => resolve(), delayMs))
    return this.awaitTokens(count)
  }
}

