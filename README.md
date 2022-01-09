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
  const limiter  = new RollingWindowLimiter({ tokensPerInterval, interval, stopped = false })
```

### Fixed Window

```js
const limiter  = new FixedWindowLimiter({ tokensPerInterval, interval, stopped = false })
```

> The Reservoir Interval starts from the moment `getTokens()` is called for the first time.


### Token bucket

```js
const limiter  = new TokenBucketLimiter({ bucketSize, tokensPerInterval, interval, stopped = false })
```

> The rate limiter can be created with initial state 'stopped' and with no tokens, by specifying the parameter `stopped` set to `true` (default is `false`). When stopped, the rate limiter needs to be restarted by calling the method `start()` 

## Properties

### `isStopped`
Boolean value indicating if the rate limiter is stopped. 

## Methods

### `tryRemoveTokens(count)`

Tries to remove a number af tokens and returns immediately a boolean value indicating if the token removal was successful. 

### `getTokens()`

Returns the number of available tokens

### `getDelayForTokens(count = 1)`

Returns the number of milliseconds until the time when `count` tokens will be available. If the tokens are immediately available, it returns `0` (zero).
If the rate limiter is stopped and the tokens are not immediately available, the method returns `undefined`.

### `async awaitTokens(count = 1)`

Returns a promise which resolves when `count` tokens become available. If the rate limiter is stopped, the promise resolves after the rate limiter is restarted and the tokens are available.

### `reset()`

Reinitializes the rate limiter, the reservoir is set to the initial size. If the limiter has been previously stopped, it is restarted.

### `stop(empty = true)`

Stops the rate limiter. Rate limiter will add no more tokens. If parameter `false` is specified, the existing tokens can still be used until exhausted. 

### `start()`

(Re)starts the rate limiter. Adding new tokens is resumed.

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
