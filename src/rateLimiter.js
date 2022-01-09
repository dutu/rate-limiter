export default class RateLimiter {
  constructor ({ tokensPerInterval, interval, stopped }) {
    this.tokensPerInterval = tokensPerInterval
    this._isStopped = stopped
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

    this.tokensRemovedAt = []
    this.awaitingRestart = new Set()
  }

  dripTokens() {
    throw new Error(`dripTokens() not implemented`)
  }

  getDelayForTokens() {
    throw new Error(`getDelayForTokens() not implemented`)
  }

  getTokens() {
    this.dripTokens()
    return Math.floor(this.tokens)
  }

  tryRemoveTokens(count) {
    this.dripTokens()
    if (count > this.tokens) {
      return false
    }

    this.tokens -= count
    this.tokensRemovedAt.push([Date.now(), count])
    return true
  }

  async awaitTokens(count = 1) {
    if (this._isStopped) {
      await new Promise((resolve) => this.awaitingRestart.add(resolve))
    }

    let delayMs = this.getDelayForTokens(count)
    if (delayMs === 0) {
      return Math.floor(this.tokens)
    }

    await new Promise((resolve) => setTimeout(() => resolve(), delayMs))
    return this.awaitTokens(count)
  }

  reset() {
    this.awaitingRestart.forEach((resolve) => resolve())
  }

  stop(empty = true) {
    this._isStopped = true
    if (empty) {
      this.tryRemoveTokens(this.getTokens())
    }
  }

  start() {
    this._isStopped = false
  }

  get isStopped() {
    return this._isStopped
  }
}

