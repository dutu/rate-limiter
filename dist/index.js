"use strict";

function _createForOfIteratorHelper(o) {
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
      var i = 0;

      var F = function F() {};

      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var it,
      normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

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

var RollingRateLimiter = /*#__PURE__*/function () {
  function RollingRateLimiter(_ref) {
    var tokensPerInterval = _ref.tokensPerInterval,
        interval = _ref.interval;

    _classCallCheck(this, RollingRateLimiter);

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

    this.tokens = this.interval;
    this.tokensRemovedAt = [];
  }

  _createClass(RollingRateLimiter, [{
    key: "getTokens",
    value: function getTokens() {
      var now = Date.now();

      while (this.tokensRemovedAt.length > 0) {
        if (this.tokensRemovedAt[0][0] + this.interval > now) {
          break;
        }

        this.tokens += this.tokensRemovedAt[0][1];
        this.tokensRemovedAt.shift();
      }

      if (this.tokens > this.tokensPerInterval) {
        this.tokens = this.tokensPerInterval;
      }

      return this.tokens;
    }
  }, {
    key: "tryRemoveTokens",
    value: function tryRemoveTokens(count) {
      if (count > this.tokensPerInterval) return false;
      this.getTokens();
      if (count > this.tokens) return false;
      this.tokens -= count;
      this.tokensRemovedAt.push([Date.now(), count]);
      return true;
    }
  }, {
    key: "awaitTokens",
    value: function () {
      var _awaitTokens = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var count,
            tokens,
            tokensNeeded,
            now,
            delay,
            _iterator,
            _step,
            newTokens,
            _ret,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                count = _args.length > 0 && _args[0] !== undefined ? _args[0] : 1;

                if (!(count > this.tokensPerInterval)) {
                  _context.next = 3;
                  break;
                }

                throw new Error("Cannot supply ".concat(count, " tokens"));

              case 3:
                tokens = this.getTokens();
                tokensNeeded = count - tokens;

                if (!(tokensNeeded <= 0)) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", tokens);

              case 7:
                now = Date.now();
                _iterator = _createForOfIteratorHelper(this.tokensRemovedAt);
                _context.prev = 9;

                _iterator.s();

              case 11:
                if ((_step = _iterator.n()).done) {
                  _context.next = 20;
                  break;
                }

                newTokens = _step.value;
                tokensNeeded -= newTokens[1];

                if (!(tokensNeeded <= 0)) {
                  _context.next = 18;
                  break;
                }

                _ret = function () {
                  var delayMs = newTokens[0] + _this.interval - now;
                  delay = new Promise(function (resolve) {
                    return setTimeout(function () {
                      return resolve();
                    }, delayMs);
                  });
                  return "break";
                }();

                if (!(_ret === "break")) {
                  _context.next = 18;
                  break;
                }

                return _context.abrupt("break", 20);

              case 18:
                _context.next = 11;
                break;

              case 20:
                _context.next = 25;
                break;

              case 22:
                _context.prev = 22;
                _context.t0 = _context["catch"](9);

                _iterator.e(_context.t0);

              case 25:
                _context.prev = 25;

                _iterator.f();

                return _context.finish(25);

              case 28:
                _context.next = 30;
                return delay;

              case 30:
                return _context.abrupt("return", this.getTokens());

              case 31:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[9, 22, 25, 28]]);
      }));

      function awaitTokens() {
        return _awaitTokens.apply(this, arguments);
      }

      return awaitTokens;
    }()
  }]);

  return RollingRateLimiter;
}();

exports["default"] = RollingRateLimiter;
//# sourceMappingURL=index.js.map