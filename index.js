const RollingWindowLimiter = require('./dist/rollingWindowLimiter.js').RollingWindowLimiter
const TokenBucketLimiter = require('./dist/tokenBucketLimiter.js').TokenBucketLimiter
const FixedWindowLimiter = require('./dist/fixedWindowLimiter.js').FixedWindowLimiter

module.exports = {
  RollingWindowLimiter,
  TokenBucketLimiter,
  FixedWindowLimiter,
}
