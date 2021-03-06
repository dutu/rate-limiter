"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var RateLimiter = /*#__PURE__*/function () {
  function RateLimiter(_ref) {
    var tokensPerInterval = _ref.tokensPerInterval,
        interval = _ref.interval;

    _classCallCheck(this, RateLimiter);

    this.tokensPerInterval = tokensPerInterval;

    if (typeof interval === 'string') {
      switch (interval) {
        case 'sec':
        case 'second':
          {
            this.interval = 1000;
            break;
          }

        case 'min':
        case 'minute':
          {
            this.interval = 1000 * 60;
            break;
          }

        case 'hr':
        case 'hour':
          {
            this.interval = 1000 * 60 * 60;
            break;
          }

        case 'day':
          {
            this.interval = 1000 * 60 * 60 * 24;
            break;
          }

        default:
          throw new Error('Invalid interval ' + interval);
      }
    } else {
      this.interval = interval;
    }

    this.tokensRemovedAt = [];
  }

  _createClass(RateLimiter, [{
    key: "dripTokens",
    value: function dripTokens() {
      throw new Error("dripTokens() not implemented");
    }
  }, {
    key: "getDelayForTokens",
    value: function getDelayForTokens() {
      throw new Error("getDelayForTokens() not implemented");
    }
  }, {
    key: "getTokens",
    value: function getTokens() {
      this.dripTokens();
      return Math.floor(this.tokens);
    }
  }, {
    key: "tryRemoveTokens",
    value: function tryRemoveTokens(count) {
      this.dripTokens();
      if (count > this.tokens) return false;
      this.tokens -= count;
      this.tokensRemovedAt.push([Date.now(), count]);
      return true;
    }
  }, {
    key: "awaitTokens",
    value: function () {
      var _awaitTokens = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var count,
            delayMs,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                count = _args.length > 0 && _args[0] !== undefined ? _args[0] : 1;
                delayMs = this.getDelayForTokens(count);

                if (!(delayMs === 0)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return", Math.floor(this.tokens));

              case 4:
                _context.next = 6;
                return new Promise(function (resolve) {
                  return setTimeout(function () {
                    return resolve();
                  }, delayMs);
                });

              case 6:
                return _context.abrupt("return", this.awaitTokens(count));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function awaitTokens() {
        return _awaitTokens.apply(this, arguments);
      }

      return awaitTokens;
    }()
  }]);

  return RateLimiter;
}();

exports["default"] = RateLimiter;
//# sourceMappingURL=rateLimiter.js.map