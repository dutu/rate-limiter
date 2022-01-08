"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenBucketLimiter = void 0;

var _rateLimiter = _interopRequireDefault(require("./rateLimiter.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var TokenBucketLimiter = /*#__PURE__*/function (_RateLimiter) {
  _inherits(TokenBucketLimiter, _RateLimiter);

  var _super = _createSuper(TokenBucketLimiter);

  function TokenBucketLimiter(_ref) {
    var _this;

    var bucketSize = _ref.bucketSize,
        tokensPerInterval = _ref.tokensPerInterval,
        interval = _ref.interval;

    _classCallCheck(this, TokenBucketLimiter);

    _this = _super.call(this, {
      tokensPerInterval: tokensPerInterval,
      interval: interval
    });
    _this.bucketSize = bucketSize; // we start with the bucket full

    _this.tokens = _this.bucketSize; // last drip

    _this.tokensRemovedAt = [Date.now()];
    return _this;
  }

  _createClass(TokenBucketLimiter, [{
    key: "dripTokens",
    value: function dripTokens() {
      var now = Date.now();
      var lastDrip = this.tokensRemovedAt[0];
      var deltaMs = Math.max(now - lastDrip, 0);
      this.tokensRemovedAt = [now];
      var tokensToAdd = deltaMs * (this.tokensPerInterval / this.interval);
      this.tokens = Math.min(this.tokens + tokensToAdd, this.bucketSize);
      return Math.floor(this.tokens);
    }
  }, {
    key: "getDelayForTokens",
    value: function getDelayForTokens() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (count > this.bucketSize) {
        throw new Error("Cannot supply ".concat(count, " tokens at once (max is bucketSize = ").concat(this.bucketSize));
      }

      this.dripTokens();
      var tokensNeeded = count - this.tokens;

      if (tokensNeeded <= 0) {
        return 0;
      }

      return Math.ceil(tokensNeeded * (this.interval / this.tokensPerInterval));
    }
  }, {
    key: "reset",
    value: function reset() {
      this.tokens = this.bucketSize;
      this.tokensRemovedAt = [Date.now()];
    }
  }]);

  return TokenBucketLimiter;
}(_rateLimiter["default"]);

exports.TokenBucketLimiter = TokenBucketLimiter;
//# sourceMappingURL=tokenBucketLimiter.js.map