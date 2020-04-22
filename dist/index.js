"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RollingWindowLimiter", {
  enumerable: true,
  get: function get() {
    return _rollingWindowLimiter["default"];
  }
});
Object.defineProperty(exports, "TokenBucketLimiter", {
  enumerable: true,
  get: function get() {
    return _tokenBucketLimiter["default"];
  }
});

var _rollingWindowLimiter = _interopRequireDefault(require("./rollingWindowLimiter.js"));

var _tokenBucketLimiter = _interopRequireDefault(require("./tokenBucketLimiter.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//# sourceMappingURL=index.js.map