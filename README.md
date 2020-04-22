rolling-rate-limiter
====

**rolling-rate-limiter** is an implementation of a rate limiter in node.js that allows for rate limiting with a rolling window

# Changelog

See detailed [Changelog](CHANGELOG.md)

# Installation

```
npm install --save "git+https://github.com/dutu/rolling-rate-limiter.git"
```

# Quick examples

```js
async function testToken() {
  const limiter  = new RollingRateLimiter({ tokensPerInterval: 20, interval: 1000 * 10 })
  debug(limiter.getTokens())
  debug(limiter.tryRemoveTokens(10))
  debug(limiter.tryRemoveTokens(32))
  debug(limiter.getTokens())
  
await new Promise((resolve) => setTimeout(() => resolve(), 2000))
  debug(limiter.tryRemoveTokens(10))
  debug(limiter.getTokens())

  debug(await limiter.awaitTokens(8))
  debug(await limiter.awaitTokens(20))

}

testToken()
```

# License

[MIT](LICENSE)
