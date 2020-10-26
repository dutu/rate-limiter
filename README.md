rolling-rate-limiter
====

**@dutu/rate-limiter** is an implementation of a rate limiter that supports rolling window and token bucket

# Changelog

The module adheres to [Semantic Versioning](http://semver.org/).

See [github releases](https://github.com/dutu/rate-limiter/releases), where all notable changes are documented.

# Installation

```
npm install --save "git+https://github.com/dutu/rate-limiter.git"
```

## Rate-limiting Algorithms

### Rolling Window

```js
  const limiter  = new RollingWindowLimiter({ tokensPerInterval: 20, interval: 1000 * 10 })
```

### Fixed Window

```js
  const limiter  = new FixedWindowLimiter({ tokensPerInterval: 20, interval: 1000 * 10 })
```

> The Reservoir Interval starts from the moment `dripTokens()` is called for the first time.


### Token bucket

```js
  const limiter  = new TokenBucketLimiter({ bucketSize: 10, tokensPerInterval: 1, interval: 'second' })
```


# Quick examples

```js
async function testToken() {
  const limiter  = new RollingWindowLimiter({ tokensPerInterval: 20, interval: 1000 * 10 })
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
