"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollingWindowLimiter = void 0;

var _rateLimiter = _interopRequireDefault(require("./rateLimiter.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var RollingWindowLimiter = /*#__PURE__*/function (_RateLimiter) {
  _inherits(RollingWindowLimiter, _RateLimiter);

  var _super = _createSuper(RollingWindowLimiter);

  function RollingWindowLimiter(_ref) {
    var _this;

    var tokensPerInterval = _ref.tokensPerInterval,
        interval = _ref.interval,
        _ref$stopped = _ref.stopped,
        stopped = _ref$stopped === void 0 ? false : _ref$stopped;

    _classCallCheck(this, RollingWindowLimiter);

    _this = _super.call(this, {
      tokensPerInterval: tokensPerInterval,
      interval: interval,
      stopped: stopped
    });
    _this.tokens = stopped ? 0 : _this.tokensPerInterval;
    return _this;
  }

  _createClass(RollingWindowLimiter, [{
    key: "dripTokens",
    value: function dripTokens() {
      if (this._isStopped) {
        return;
      }

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
    key: "getDelayForTokens",
    value: function getDelayForTokens() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (count > this.tokensPerInterval) {
        throw new Error("Cannot supply ".concat(count, " tokens at once (max is tokensPerInterval = ").concat(this.tokensPerInterval));
      }

      this.dripTokens();
      var tokensNeeded = count - this.tokens;

      if (tokensNeeded <= 0) {
        return 0;
      }

      if (this._isStopped) {
        return undefined;
      }

      var now = Date.now();

      var _iterator = _createForOfIteratorHelper(this.tokensRemovedAt),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var newTokens = _step.value;
          tokensNeeded -= newTokens[1];

          if (tokensNeeded <= 0) {
            var delayMs = newTokens[0] + this.interval - now;
            return delayMs;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this._isStopped = false;
      this.tokensRemovedAt = [];
      this.tokens = this.tokensPerInterval;

      _get(_getPrototypeOf(RollingWindowLimiter.prototype), "reset", this).call(this);
    }
  }]);

  return RollingWindowLimiter;
}(_rateLimiter["default"]);

exports.RollingWindowLimiter = RollingWindowLimiter;
//# sourceMappingURL=rollingWindowLimiter.js.map