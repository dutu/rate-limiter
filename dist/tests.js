"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _dist = _interopRequireDefault(require("../dist"));

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
    var limiter = new _dist["default"]({
      tokensPerInterval: 10,
      interval: 10 * 1000
    });
    expect(limiter).to.be.an.instanceOf(_dist["default"]);
  });
});
describe("getTokens()", function () {
  it('should return correct number of tokens', function () {
    var limiter = new _dist["default"]({
      tokensPerInterval: 10,
      interval: 10 * 1000
    });
    expect(limiter.getTokens()).to.be.equal(10);
  });
});
describe("tryRemoveTokens()", function () {
  it('should remove correct number of tokens', function () {
    var limiter = new _dist["default"]({
      tokensPerInterval: 10,
      interval: 10 * 1000
    });
    var removedTokens = limiter.tryRemoveTokens(2);
    expect(removedTokens).to.be.equal(true);
    expect(limiter.getTokens()).to.be.equal(8);
    removedTokens = limiter.tryRemoveTokens(20);
    expect(removedTokens).to.be.equal(false);
    expect(limiter.getTokens()).to.be.equal(8);
    removedTokens = limiter.tryRemoveTokens(0);
    expect(removedTokens).to.be.equal(true);
    expect(limiter.getTokens()).to.be.equal(8);
  });
});
describe("awaitTokens()", function () {
  it('should await right number of tokens', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var limiter, removedTokens, tokens;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            limiter = new _dist["default"]({
              tokensPerInterval: 10,
              interval: 1000
            });
            removedTokens = limiter.tryRemoveTokens(2);
            expect(removedTokens).to.be.equal(true);
            expect(limiter.getTokens()).to.be.equal(8);
            _context.next = 6;
            return delay(100);

          case 6:
            removedTokens = limiter.tryRemoveTokens(8);
            expect(removedTokens).to.be.equal(true);
            expect(limiter.getTokens()).to.be.equal(0);
            _context.next = 11;
            return delay(800);

          case 11:
            expect(limiter.getTokens()).to.be.equal(0);
            _context.next = 14;
            return limiter.awaitTokens(2);

          case 14:
            tokens = _context.sent;
            expect(limiter.getTokens()).to.be.equal(2);
            expect(tokens).to.be.equal(2);
            _context.next = 19;
            return limiter.awaitTokens(8);

          case 19:
            tokens = _context.sent;
            expect(limiter.getTokens()).to.be.equal(10);
            expect(tokens).to.be.equal(10);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
});
//# sourceMappingURL=tests.js.map