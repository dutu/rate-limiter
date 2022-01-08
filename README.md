rate-limiter
====

**@dutu/rate-limiter** is an implementation of a rate limiter that supports token bucket, rolling window and fixed window 

# Changelog

The module adheres to [Semantic Versioning](http://semver.org/).

See [github releases](https://github.com/dutu/rate-limiter/releases), where all notable changes are documented.

# Installation

```
npm install --save "git+https://github.com/dutu/rate-limiter.git"
```

# Usage

```js
import { RollingWindowLimiter } from '@dutu/rate-limiter'
import { TokenBucketLimiter } from '@dutu/rate-limiter'
import { FixedWindowLimiter } from '@dutu/rate-limiter'
```
or
```js
const RollingWindowLimiter = require('@dutu/rate-limiter').RollingWindowLimiter
const TokenBucketLimiter = require('@dutu/rate-limiter').TokenBucketLimiter
const FixedWindowLimiter = require('@dutu/rate-limiter').FixedWindowLimiter
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

> The Reservoir Interval starts from the moment `getTokens()` is called for the first time.


### Token bucket

```js
  const limiter  = new TokenBucketLimiter({ bucketSize: 10, tokensPerInterval: 1, interval: 'second' })
```

## Methods

### `tryRemoveTokens(count)`

Tries to remove a number af tokens and returns immediately a boolean value indicating if the token removal was successful. 

### `getTokens()`

Returns the number of available tokens

### `getDelayForTokens(count = 1)`

Returns the number of milliseconds until the time when the number of specified tokens will be available. 

### `async awaitTokens(count = 1)`

Asynchronous method which resolves when the numbers of specified tokens become available.

### `reset()`

Reinitializes the rate limiter.

## Quick examples

```js
import { RollingWindowLimiter } from '@dutu/rate-limiter'

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
