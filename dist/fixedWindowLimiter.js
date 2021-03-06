"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _rateLimiter = _interopRequireDefault(require("./rateLimiter.mjs"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var FixedWindowLimiter = /*#__PURE__*/function (_rateLimiter$default) {
  _inherits(FixedWindowLimiter, _rateLimiter$default);

  var _super = _createSuper(FixedWindowLimiter);

  function FixedWindowLimiter(_ref) {
    var _this;

    var tokensPerInterval = _ref.tokensPerInterval,
        interval = _ref.interval;

    _classCallCheck(this, FixedWindowLimiter);

    _this = _super.call(this, {
      tokensPerInterval: tokensPerInterval,
      interval: interval
    });
    _this.nextDripAt = 0;
    return _this;
  }

  _createClass(FixedWindowLimiter, [{
    key: "dripTokens",
    value: function dripTokens() {
      this.tokensRemovedAt = [];

      if (Date.now() >= this.nextDripAt) {
        this.tokens = this.tokensPerInterval;
        this.nextDripAt = Date.now() + this.interval;
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

      if (count <= this.tokens) {
        return 0;
      }

      return this.nextDripAt - Date.now();
    }
  }]);

  return FixedWindowLimiter;
}(_rateLimiter["default"]);

exports["default"] = FixedWindowLimiter;
//# sourceMappingURL=fixedWindowLimiter.js.map