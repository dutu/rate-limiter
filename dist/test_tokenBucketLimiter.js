"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _index = require("../index.mjs");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
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

var expect = _chai["default"].expect;

var delay = function delay(ms) {
  return new Promise(function (resolve) {
    return setTimeout(function () {
      return resolve();
    }, ms);
  });
};

describe("Constructor", function () {
  it('should create a new instance', function () {
    var limiter = new _index.TokenBucketLimiter({
      bucketSize: 10,
      tokensPerInterval: 1,
      interval: 'second'
    });
    expect(limiter).to.be.an.instanceOf(_index.TokenBucketLimiter);
  });
});
describe("getTokens()", function () {
  it('should return correct number of tokens', function () {
    var limiter = new _index.TokenBucketLimiter({
      bucketSize: 10,
      tokensPerInterval: 1,
      interval: 'second'
    });
    expect(limiter.getTokens()).to.be.equal(10);
  });
});
describe("tryRemoveTokens()", function () {
  it('should remove correct number of tokens', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var limiter, removedTokens;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            limiter = new _index.TokenBucketLimiter({
              bucketSize: 10,
              tokensPerInterval: 2,
              interval: 'second'
            });
            removedTokens = limiter.tryRemoveTokens(8);
            expect(removedTokens).to.be.equal(true);
            expect(limiter.getTokens()).to.be.equal(2);
            _context.next = 6;
            return delay(900);

          case 6:
            expect(limiter.getTokens()).to.be.equal(3);
            _context.next = 9;
            return delay(100);

          case 9:
            expect(limiter.getTokens()).to.be.equal(4);
            removedTokens = limiter.tryRemoveTokens(20);
            expect(removedTokens).to.be.equal(false);
            expect(limiter.getTokens()).to.be.equal(4);
            _context.next = 15;
            return delay(2000 - 100);

          case 15:
            expect(limiter.getTokens()).to.be.equal(7);
            _context.next = 18;
            return delay(100);

          case 18:
            expect(limiter.getTokens()).to.be.equal(8);
            removedTokens = limiter.tryRemoveTokens(0);
            expect(removedTokens).to.be.equal(true);
            expect(limiter.getTokens()).to.be.equal(8);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
});
describe("awaitTokens()", function () {
  it('should await right number of tokens', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var limiter, removedTokens, tokens;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            limiter = new _index.TokenBucketLimiter({
              bucketSize: 10,
              tokensPerInterval: 3,
              interval: 'second'
            });
            removedTokens = limiter.tryRemoveTokens(4);
            expect(removedTokens).to.be.equal(true);
            expect(limiter.getTokens()).to.be.equal(6);
            _context2.next = 6;
            return limiter.awaitTokens(2);

          case 6:
            tokens = _context2.sent;
            expect(limiter.getTokens()).to.be.equal(6);
            expect(tokens).to.be.equal(6);
            _context2.next = 11;
            return limiter.awaitTokens(9);

          case 11:
            tokens = _context2.sent;
            expect(limiter.getTokens()).to.be.equal(9);
            expect(tokens).to.be.equal(9);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});
//# sourceMappingURL=test_tokenBucketLimiter.js.map