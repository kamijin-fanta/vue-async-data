'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var optionNames = ['Default', 'Lazy'];
var isOptionName = function isOptionName(key) {
  var names = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : optionNames;
  return names.find(function (n) {
    return key.endsWith(n);
  });
};

var AsyncDataMixin = {
  created: function created() {},
  mounted: function mounted() {
    this.asyncReload(undefined, true);
  },

  methods: {
    asyncReload: function asyncReload(propertyName) {
      var _this = this;

      var skipLazy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var asyncData = this.$options.asyncData;
      if (asyncData) {
        var _ret = function () {
          var names = (0, _keys2.default)(asyncData).filter(function (s) {
            return !isOptionName(s);
          }).filter(function (s) {
            return propertyName === undefined || s === propertyName;
          }).filter(function (s) {
            return skipLazy === false || !asyncData[s + 'Lazy'];
          });

          if (propertyName !== undefined && names.length === 0) {
            console.error('asyncData.' + propertyName + ' cannot find.', _this);
            return {
              v: void 0
            };
          }

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            var _loop = function _loop() {
              var prop = _step.value;

              var setData = function setData(data) {
                _this[prop] = data;
              };
              var setError = function setError(err) {
                _this[prop + 'Error'] = err;
                if (err) _this.asyncError = true;else _this.asyncError = !!names.find(function (n) {
                  return _this[n + 'Error'];
                });
              };
              var setLoading = function setLoading(flag) {
                _this[prop + 'Loading'] = flag;
                if (flag) _this.asyncLoading = true;else _this.asyncLoading = !!names.find(function (n) {
                  return _this[n + 'Loading'];
                });
              };

              setLoading(true);
              setError(undefined);

              if (typeof asyncData[prop] !== 'function') {
                console.error('asyncData.' + prop + ' must be funtion. actual: ' + asyncData[prop], _this);
                return 'continue';
              }
              asyncData[prop].apply(_this).then(function (res) {
                setData(res);
                setLoading(false);
              }).catch(function (err) {
                setError(err);
                setLoading(false);
              });
            };

            for (var _iterator = (0, _getIterator3.default)(names), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _ret2 = _loop();

              if (_ret2 === 'continue') continue;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
      }
    }
  },
  data: function data() {
    var asyncData = this.$options.asyncData;
    if (asyncData) {
      var _ret3 = function () {
        var dataObj = {
          'asyncLoading': true,
          'asyncError': false
        };

        var names = (0, _keys2.default)(asyncData).filter(function (s) {
          return !isOptionName(s);
        });
        names.forEach(function (name) {
          dataObj[name] = asyncData[name + 'Default'];
        });

        names.forEach(function (name) {
          var loadingName = name + 'Loading';
          dataObj[loadingName] = !(name + 'Lazy');
        });

        var errorNames = names.map(function (s) {
          return s + 'Error';
        });
        errorNames.forEach(function (name) {
          dataObj[name] = undefined;
        });

        return {
          v: dataObj
        };
      }();

      if ((typeof _ret3 === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret3)) === "object") return _ret3.v;
    }
    return {};
  }
};

var AsyncDataPlugin = {
  install: function install(Vue, options) {
    Vue.mixin(AsyncDataMixin);
  }
};

var api = {
  AsyncDataPlugin: AsyncDataPlugin,
  AsyncDataMixin: AsyncDataMixin
};

if ((typeof exports === 'undefined' ? 'undefined' : (0, _typeof3.default)(exports)) === 'object' && (typeof module === 'undefined' ? 'undefined' : (0, _typeof3.default)(module)) === 'object') {
  module.exports = api;
} else if (typeof window !== 'undefined') {
  window.AsyncDataMixin = AsyncDataMixin;
  window.AsyncDataPlugin = AsyncDataPlugin;
}
