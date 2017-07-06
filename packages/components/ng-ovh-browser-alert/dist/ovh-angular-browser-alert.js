(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * Bowser - a browser detector
 * https://github.com/ded/bowser
 * MIT License | (c) Dustin Diaz 2015
 */

!function (root, name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(name, definition)
  else root[name] = definition()
}(this, 'bowser', function () {
  /**
    * See useragents.js for examples of navigator.userAgent
    */

  var t = true

  function detect(ua) {

    function getFirstMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[1]) || '';
    }

    function getSecondMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[2]) || '';
    }

    var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
      , likeAndroid = /like android/i.test(ua)
      , android = !likeAndroid && /android/i.test(ua)
      , nexusMobile = /nexus\s*[0-6]\s*/i.test(ua)
      , nexusTablet = !nexusMobile && /nexus\s*[0-9]+/i.test(ua)
      , chromeos = /CrOS/.test(ua)
      , silk = /silk/i.test(ua)
      , sailfish = /sailfish/i.test(ua)
      , tizen = /tizen/i.test(ua)
      , webos = /(web|hpw)os/i.test(ua)
      , windowsphone = /windows phone/i.test(ua)
      , samsungBrowser = /SamsungBrowser/i.test(ua)
      , windows = !windowsphone && /windows/i.test(ua)
      , mac = !iosdevice && !silk && /macintosh/i.test(ua)
      , linux = !android && !sailfish && !tizen && !webos && /linux/i.test(ua)
      , edgeVersion = getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
      , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
      , tablet = /tablet/i.test(ua)
      , mobile = !tablet && /[^-]mobi/i.test(ua)
      , xbox = /xbox/i.test(ua)
      , result

    if (/opera/i.test(ua)) {
      //  an old Opera
      result = {
        name: 'Opera'
      , opera: t
      , version: versionIdentifier || getFirstMatch(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
      }
    } else if (/opr|opios/i.test(ua)) {
      // a new Opera
      result = {
        name: 'Opera'
        , opera: t
        , version: getFirstMatch(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (/SamsungBrowser/i.test(ua)) {
      result = {
        name: 'Samsung Internet for Android'
        , samsungBrowser: t
        , version: versionIdentifier || getFirstMatch(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/coast/i.test(ua)) {
      result = {
        name: 'Opera Coast'
        , coast: t
        , version: versionIdentifier || getFirstMatch(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/yabrowser/i.test(ua)) {
      result = {
        name: 'Yandex Browser'
      , yandexbrowser: t
      , version: versionIdentifier || getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/ucbrowser/i.test(ua)) {
      result = {
          name: 'UC Browser'
        , ucbrowser: t
        , version: getFirstMatch(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/mxios/i.test(ua)) {
      result = {
        name: 'Maxthon'
        , maxthon: t
        , version: getFirstMatch(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/epiphany/i.test(ua)) {
      result = {
        name: 'Epiphany'
        , epiphany: t
        , version: getFirstMatch(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/puffin/i.test(ua)) {
      result = {
        name: 'Puffin'
        , puffin: t
        , version: getFirstMatch(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
      }
    }
    else if (/sleipnir/i.test(ua)) {
      result = {
        name: 'Sleipnir'
        , sleipnir: t
        , version: getFirstMatch(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/k-meleon/i.test(ua)) {
      result = {
        name: 'K-Meleon'
        , kMeleon: t
        , version: getFirstMatch(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (windowsphone) {
      result = {
        name: 'Windows Phone'
      , windowsphone: t
      }
      if (edgeVersion) {
        result.msedge = t
        result.version = edgeVersion
      }
      else {
        result.msie = t
        result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/msie|trident/i.test(ua)) {
      result = {
        name: 'Internet Explorer'
      , msie: t
      , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
      }
    } else if (chromeos) {
      result = {
        name: 'Chrome'
      , chromeos: t
      , chromeBook: t
      , chrome: t
      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    } else if (/chrome.+? edge/i.test(ua)) {
      result = {
        name: 'Microsoft Edge'
      , msedge: t
      , version: edgeVersion
      }
    }
    else if (/vivaldi/i.test(ua)) {
      result = {
        name: 'Vivaldi'
        , vivaldi: t
        , version: getFirstMatch(/vivaldi\/(\d+(\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (sailfish) {
      result = {
        name: 'Sailfish'
      , sailfish: t
      , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/seamonkey\//i.test(ua)) {
      result = {
        name: 'SeaMonkey'
      , seamonkey: t
      , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/firefox|iceweasel|fxios/i.test(ua)) {
      result = {
        name: 'Firefox'
      , firefox: t
      , version: getFirstMatch(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
      }
      if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
        result.firefoxos = t
      }
    }
    else if (silk) {
      result =  {
        name: 'Amazon Silk'
      , silk: t
      , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/phantom/i.test(ua)) {
      result = {
        name: 'PhantomJS'
      , phantom: t
      , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/slimerjs/i.test(ua)) {
      result = {
        name: 'SlimerJS'
        , slimer: t
        , version: getFirstMatch(/slimerjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
      result = {
        name: 'BlackBerry'
      , blackberry: t
      , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
      }
    }
    else if (webos) {
      result = {
        name: 'WebOS'
      , webos: t
      , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
      };
      /touchpad\//i.test(ua) && (result.touchpad = t)
    }
    else if (/bada/i.test(ua)) {
      result = {
        name: 'Bada'
      , bada: t
      , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
      };
    }
    else if (tizen) {
      result = {
        name: 'Tizen'
      , tizen: t
      , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (/qupzilla/i.test(ua)) {
      result = {
        name: 'QupZilla'
        , qupzilla: t
        , version: getFirstMatch(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || versionIdentifier
      }
    }
    else if (/chromium/i.test(ua)) {
      result = {
        name: 'Chromium'
        , chromium: t
        , version: getFirstMatch(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (/chrome|crios|crmo/i.test(ua)) {
      result = {
        name: 'Chrome'
        , chrome: t
        , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    }
    else if (android) {
      result = {
        name: 'Android'
        , version: versionIdentifier
      }
    }
    else if (/safari|applewebkit/i.test(ua)) {
      result = {
        name: 'Safari'
      , safari: t
      }
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if (iosdevice) {
      result = {
        name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
      }
      // WTF: version is not part of user agent in web apps
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if(/googlebot/i.test(ua)) {
      result = {
        name: 'Googlebot'
      , googlebot: t
      , version: getFirstMatch(/googlebot\/(\d+(\.\d+))/i) || versionIdentifier
      }
    }
    else {
      result = {
        name: getFirstMatch(/^(.*)\/(.*) /),
        version: getSecondMatch(/^(.*)\/(.*) /)
     };
   }

    // set webkit or gecko flag for browsers based on these engines
    if (!result.msedge && /(apple)?webkit/i.test(ua)) {
      if (/(apple)?webkit\/537\.36/i.test(ua)) {
        result.name = result.name || "Blink"
        result.blink = t
      } else {
        result.name = result.name || "Webkit"
        result.webkit = t
      }
      if (!result.version && versionIdentifier) {
        result.version = versionIdentifier
      }
    } else if (!result.opera && /gecko\//i.test(ua)) {
      result.name = result.name || "Gecko"
      result.gecko = t
      result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
    }

    // set OS flags for platforms that have multiple browsers
    if (!result.windowsphone && !result.msedge && (android || result.silk)) {
      result.android = t
    } else if (!result.windowsphone && !result.msedge && iosdevice) {
      result[iosdevice] = t
      result.ios = t
    } else if (mac) {
      result.mac = t
    } else if (xbox) {
      result.xbox = t
    } else if (windows) {
      result.windows = t
    } else if (linux) {
      result.linux = t
    }

    function getWindowsVersion (s) {
      switch (s) {
        case 'NT': return 'NT'
        case 'XP': return 'XP'
        case 'NT 5.0': return '2000'
        case 'NT 5.1': return 'XP'
        case 'NT 5.2': return '2003'
        case 'NT 6.0': return 'Vista'
        case 'NT 6.1': return '7'
        case 'NT 6.2': return '8'
        case 'NT 6.3': return '8.1'
        case 'NT 10.0': return '10'
        default: return undefined
      }
    }
    
    // OS version extraction
    var osVersion = '';
    if (result.windows) {
      osVersion = getWindowsVersion(getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i))
    } else if (result.windowsphone) {
      osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
    } else if (result.mac) {
      osVersion = getFirstMatch(/Mac OS X (\d+([_\.\s]\d+)*)/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (iosdevice) {
      osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (android) {
      osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
    } else if (result.webos) {
      osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
    } else if (result.blackberry) {
      osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
    } else if (result.bada) {
      osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
    } else if (result.tizen) {
      osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
    }
    if (osVersion) {
      result.osversion = osVersion;
    }

    // device type extraction
    var osMajorVersion = !result.windows && osVersion.split('.')[0];
    if (
         tablet
      || nexusTablet
      || iosdevice == 'ipad'
      || (android && (osMajorVersion == 3 || (osMajorVersion >= 4 && !mobile)))
      || result.silk
    ) {
      result.tablet = t
    } else if (
         mobile
      || iosdevice == 'iphone'
      || iosdevice == 'ipod'
      || android
      || nexusMobile
      || result.blackberry
      || result.webos
      || result.bada
    ) {
      result.mobile = t
    }

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if (result.msedge ||
        (result.msie && result.version >= 10) ||
        (result.yandexbrowser && result.version >= 15) ||
		    (result.vivaldi && result.version >= 1.0) ||
        (result.chrome && result.version >= 20) ||
        (result.samsungBrowser && result.version >= 4) ||
        (result.firefox && result.version >= 20.0) ||
        (result.safari && result.version >= 6) ||
        (result.opera && result.version >= 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] >= 6) ||
        (result.blackberry && result.version >= 10.1)
        || (result.chromium && result.version >= 20)
        ) {
      result.a = t;
    }
    else if ((result.msie && result.version < 10) ||
        (result.chrome && result.version < 20) ||
        (result.firefox && result.version < 20.0) ||
        (result.safari && result.version < 6) ||
        (result.opera && result.version < 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
        || (result.chromium && result.version < 20)
        ) {
      result.c = t
    } else result.x = t

    return result
  }

  var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent || '' : '')

  bowser.test = function (browserList) {
    for (var i = 0; i < browserList.length; ++i) {
      var browserItem = browserList[i];
      if (typeof browserItem=== 'string') {
        if (browserItem in bowser) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get version precisions count
   *
   * @example
   *   getVersionPrecision("1.10.3") // 3
   *
   * @param  {string} version
   * @return {number}
   */
  function getVersionPrecision(version) {
    return version.split(".").length;
  }

  /**
   * Array::map polyfill
   *
   * @param  {Array} arr
   * @param  {Function} iterator
   * @return {Array}
   */
  function map(arr, iterator) {
    var result = [], i;
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, iterator);
    }
    for (i = 0; i < arr.length; i++) {
      result.push(iterator(arr[i]));
    }
    return result;
  }

  /**
   * Calculate browser version weight
   *
   * @example
   *   compareVersions(['1.10.2.1',  '1.8.2.1.90'])    // 1
   *   compareVersions(['1.010.2.1', '1.09.2.1.90']);  // 1
   *   compareVersions(['1.10.2.1',  '1.10.2.1']);     // 0
   *   compareVersions(['1.10.2.1',  '1.0800.2']);     // -1
   *
   * @param  {Array<String>} versions versions to compare
   * @return {Number} comparison result
   */
  function compareVersions(versions) {
    // 1) get common precision for both versions, for example for "10.0" and "9" it should be 2
    var precision = Math.max(getVersionPrecision(versions[0]), getVersionPrecision(versions[1]));
    var chunks = map(versions, function (version) {
      var delta = precision - getVersionPrecision(version);

      // 2) "9" -> "9.0" (for precision = 2)
      version = version + new Array(delta + 1).join(".0");

      // 3) "9.0" -> ["000000000"", "000000009"]
      return map(version.split("."), function (chunk) {
        return new Array(20 - chunk.length).join("0") + chunk;
      }).reverse();
    });

    // iterate in reverse order by reversed chunks array
    while (--precision >= 0) {
      // 4) compare: "000000009" > "000000010" = false (but "9" > "10" = true)
      if (chunks[0][precision] > chunks[1][precision]) {
        return 1;
      }
      else if (chunks[0][precision] === chunks[1][precision]) {
        if (precision === 0) {
          // all version chunks are same
          return 0;
        }
      }
      else {
        return -1;
      }
    }
  }

  /**
   * Check if browser is unsupported
   *
   * @example
   *   bowser.isUnsupportedBrowser({
   *     msie: "10",
   *     firefox: "23",
   *     chrome: "29",
   *     safari: "5.1",
   *     opera: "16",
   *     phantom: "534"
   *   });
   *
   * @param  {Object}  minVersions map of minimal version to browser
   * @param  {Boolean} [strictMode = false] flag to return false if browser wasn't found in map
   * @param  {String}  [ua] user agent string
   * @return {Boolean}
   */
  function isUnsupportedBrowser(minVersions, strictMode, ua) {
    var _bowser = bowser;

    // make strictMode param optional with ua param usage
    if (typeof strictMode === 'string') {
      ua = strictMode;
      strictMode = void(0);
    }

    if (strictMode === void(0)) {
      strictMode = false;
    }
    if (ua) {
      _bowser = detect(ua);
    }

    var version = "" + _bowser.version;
    for (var browser in minVersions) {
      if (minVersions.hasOwnProperty(browser)) {
        if (_bowser[browser]) {
          if (typeof minVersions[browser] !== 'string') {
            throw new Error('Browser version in the minVersion map should be a string: ' + browser + ': ' + String(minVersions));
          }

          // browser version and min supported version.
          return compareVersions([version, minVersions[browser]]) < 0;
        }
      }
    }

    return strictMode; // not found
  }

  /**
   * Check if browser is supported
   *
   * @param  {Object} minVersions map of minimal version to browser
   * @param  {Boolean} [strictMode = false] flag to return false if browser wasn't found in map
   * @param  {String}  [ua] user agent string
   * @return {Boolean}
   */
  function check(minVersions, strictMode, ua) {
    return !isUnsupportedBrowser(minVersions, strictMode, ua);
  }

  bowser.isUnsupportedBrowser = isUnsupportedBrowser;
  bowser.compareVersions = compareVersions;
  bowser.check = check;

  /*
   * Set our detect method to the main bowser object so we can
   * reuse it to test other user agents.
   * This is needed to implement future tests.
   */
  bowser._detect = detect;

  return bowser
});

},{}],2:[function(require,module,exports){
"use strict";

var _ovhAngularBrowserAlert = require("./ovh-angular-browser-alert.component");

var _ovhAngularBrowserAlert2 = _interopRequireDefault(_ovhAngularBrowserAlert);

var _ovhAngularBrowserAlert3 = require("./ovh-angular-browser-alert.service");

var _ovhAngularBrowserAlert4 = _interopRequireDefault(_ovhAngularBrowserAlert3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module("ovhBrowserAlert", []).service("browserAlertService", _ovhAngularBrowserAlert4.default).component("ovhBrowserAlert", _ovhAngularBrowserAlert2.default);

},{"./ovh-angular-browser-alert.component":3,"./ovh-angular-browser-alert.service":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ovhAngularBrowserAlert = require("./ovh-angular-browser-alert.controller");

var _ovhAngularBrowserAlert2 = _interopRequireDefault(_ovhAngularBrowserAlert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = "<div class=\"browser-alert__container\"\n     data-ng-if=\"!isDismissed && (isDeprecated || !isSupported)\">\n    <div data-ng-if=\"isDeprecated && isSupported && !isDismissed\">\n        <div class=\"oui-message oui-message_warning\" role=\"alert\" style=\"margin: 0 auto\">\n            <i class=\"oui-icon oui-icon-warning_circle oui-icon_bicolor\" aria-hidden=\"true\"></i>\n            <p class=\"oui-message__body\">\n                <span data-translate=\"browser_alert_deprecated\"></span>\n                <span data-translate=\"browser_alert_update\"></span>\n            </p>\n            <button class=\"oui-icon oui-icon-close oui-message__close-button\" type=\"button\" data-ng-click=\"$ctrl.dismissAlert()\">\n                <span class=\"sr-only\" style=\"display: none;\" data-translate=\"browser_alert_close\"></span>\n            </button>\n        </div>\n    </div>\n    <div data-ng-if=\"!isSupported && !isDismissed\">\n        <div class=\"oui-message oui-message_error\" role=\"alert\" style=\"margin: 0 auto\">\n            <i class=\"oui-icon oui-icon-error_circle oui-icon_bicolor\" aria-hidden=\"true\"></i>\n            <p class=\"oui-message__body\">\n                <span data-translate=\"browser_alert_not_supported\"></span>\n                <span data-translate=\"browser_alert_update\"></span>\n            </p>\n        </div>\n    </div>\n</div>\n";
exports.default = {
    template: template,
    controller: _ovhAngularBrowserAlert2.default
};

},{"./ovh-angular-browser-alert.controller":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class($scope, browserAlertService) {
        "ngInject";

        _classCallCheck(this, _class);

        this.alertSvc = browserAlertService;
        this.$scope = $scope;

        this.$scope.isSupported = this.alertSvc.isSupported();
        this.$scope.isDeprecated = this.alertSvc.isDeprecated();
    }

    _createClass(_class, [{
        key: "dismissAlert",
        value: function dismissAlert() {
            this.$scope.isDismissed = true;
        }
    }]);

    return _class;
}();

exports.default = _class;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bowser = require("bowser");

var _bowser2 = _interopRequireDefault(_bowser);

var _supported_browsers = require("./supported_browsers.json");

var _supported_browsers2 = _interopRequireDefault(_supported_browsers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: "isSupported",
        value: function isSupported() {
            return _bowser2.default.check(_supported_browsers2.default.unsupported);
        }
    }, {
        key: "isDeprecated",
        value: function isDeprecated() {
            return !_bowser2.default.check(_supported_browsers2.default.deprecated);
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"./supported_browsers.json":6,"bowser":1}],6:[function(require,module,exports){
module.exports={
  // List of browsers keys https://github.com/lancedikson/bowser/blob/master/README.md
  // Minimum versions :
  "deprecated": {
    "firefox": "52",
    "chrome": "58",
    "msie": "11",
    "msedge": "14",
    "safari": "9",
    "opera": "44"
  },
  "unsupported": {
    "firefox": "45",
    "chrome": "51",
    "msie": "10",
    "msedge": "12",
    "safari": "8",
    "opera": "37"
  }
}

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYm93c2VyL3NyYy9ib3dzZXIuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvb3ZoLWFuZ3VsYXItYnJvd3Nlci1hbGVydC5jb21wb25lbnQuanMiLCJzcmMvb3ZoLWFuZ3VsYXItYnJvd3Nlci1hbGVydC5jb250cm9sbGVyLmpzIiwic3JjL292aC1hbmd1bGFyLWJyb3dzZXItYWxlcnQuc2VydmljZS5qcyIsInNyYy9zdXBwb3J0ZWRfYnJvd3NlcnMuanNvbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN6bEJBOzs7O0FBQ0E7Ozs7OztBQUVBLFFBQVEsTUFBUixDQUFlLGlCQUFmLEVBQWtDLEVBQWxDLEVBQ0ssT0FETCxDQUNhLHFCQURiLG9DQUVLLFNBRkwsQ0FFZSxpQkFGZjs7Ozs7Ozs7O0FDSEE7Ozs7Ozs7a0JBR2U7QUFDWCxzQkFEVztBQUVYO0FBRlcsQzs7Ozs7Ozs7Ozs7Ozs7QUNGWCxvQkFBYSxNQUFiLEVBQXFCLG1CQUFyQixFQUEwQztBQUN0Qzs7QUFEc0M7O0FBR3RDLGFBQUssUUFBTCxHQUFnQixtQkFBaEI7QUFDQSxhQUFLLE1BQUwsR0FBYyxNQUFkOztBQUVBLGFBQUssTUFBTCxDQUFZLFdBQVosR0FBMEIsS0FBSyxRQUFMLENBQWMsV0FBZCxFQUExQjtBQUNBLGFBQUssTUFBTCxDQUFZLFlBQVosR0FBMkIsS0FBSyxRQUFMLENBQWMsWUFBZCxFQUEzQjtBQUNIOzs7O3VDQUVlO0FBQ1osaUJBQUssTUFBTCxDQUFZLFdBQVosR0FBMEIsSUFBMUI7QUFDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiTDs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7c0NBR21CO0FBQ1gsbUJBQU8saUJBQU8sS0FBUCxDQUFhLDZCQUFTLFdBQXRCLENBQVA7QUFDSDs7O3VDQUVlO0FBQ1osbUJBQU8sQ0FBQyxpQkFBTyxLQUFQLENBQWEsNkJBQVMsVUFBdEIsQ0FBUjtBQUNIOzs7Ozs7Ozs7QUNWTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBCb3dzZXIgLSBhIGJyb3dzZXIgZGV0ZWN0b3JcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvYm93c2VyXG4gKiBNSVQgTGljZW5zZSB8IChjKSBEdXN0aW4gRGlheiAyMDE1XG4gKi9cblxuIWZ1bmN0aW9uIChyb290LCBuYW1lLCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKG5hbWUsIGRlZmluaXRpb24pXG4gIGVsc2Ugcm9vdFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSh0aGlzLCAnYm93c2VyJywgZnVuY3Rpb24gKCkge1xuICAvKipcbiAgICAqIFNlZSB1c2VyYWdlbnRzLmpzIGZvciBleGFtcGxlcyBvZiBuYXZpZ2F0b3IudXNlckFnZW50XG4gICAgKi9cblxuICB2YXIgdCA9IHRydWVcblxuICBmdW5jdGlvbiBkZXRlY3QodWEpIHtcblxuICAgIGZ1bmN0aW9uIGdldEZpcnN0TWF0Y2gocmVnZXgpIHtcbiAgICAgIHZhciBtYXRjaCA9IHVhLm1hdGNoKHJlZ2V4KTtcbiAgICAgIHJldHVybiAobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID4gMSAmJiBtYXRjaFsxXSkgfHwgJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2Vjb25kTWF0Y2gocmVnZXgpIHtcbiAgICAgIHZhciBtYXRjaCA9IHVhLm1hdGNoKHJlZ2V4KTtcbiAgICAgIHJldHVybiAobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID4gMSAmJiBtYXRjaFsyXSkgfHwgJyc7XG4gICAgfVxuXG4gICAgdmFyIGlvc2RldmljZSA9IGdldEZpcnN0TWF0Y2goLyhpcG9kfGlwaG9uZXxpcGFkKS9pKS50b0xvd2VyQ2FzZSgpXG4gICAgICAsIGxpa2VBbmRyb2lkID0gL2xpa2UgYW5kcm9pZC9pLnRlc3QodWEpXG4gICAgICAsIGFuZHJvaWQgPSAhbGlrZUFuZHJvaWQgJiYgL2FuZHJvaWQvaS50ZXN0KHVhKVxuICAgICAgLCBuZXh1c01vYmlsZSA9IC9uZXh1c1xccypbMC02XVxccyovaS50ZXN0KHVhKVxuICAgICAgLCBuZXh1c1RhYmxldCA9ICFuZXh1c01vYmlsZSAmJiAvbmV4dXNcXHMqWzAtOV0rL2kudGVzdCh1YSlcbiAgICAgICwgY2hyb21lb3MgPSAvQ3JPUy8udGVzdCh1YSlcbiAgICAgICwgc2lsayA9IC9zaWxrL2kudGVzdCh1YSlcbiAgICAgICwgc2FpbGZpc2ggPSAvc2FpbGZpc2gvaS50ZXN0KHVhKVxuICAgICAgLCB0aXplbiA9IC90aXplbi9pLnRlc3QodWEpXG4gICAgICAsIHdlYm9zID0gLyh3ZWJ8aHB3KW9zL2kudGVzdCh1YSlcbiAgICAgICwgd2luZG93c3Bob25lID0gL3dpbmRvd3MgcGhvbmUvaS50ZXN0KHVhKVxuICAgICAgLCBzYW1zdW5nQnJvd3NlciA9IC9TYW1zdW5nQnJvd3Nlci9pLnRlc3QodWEpXG4gICAgICAsIHdpbmRvd3MgPSAhd2luZG93c3Bob25lICYmIC93aW5kb3dzL2kudGVzdCh1YSlcbiAgICAgICwgbWFjID0gIWlvc2RldmljZSAmJiAhc2lsayAmJiAvbWFjaW50b3NoL2kudGVzdCh1YSlcbiAgICAgICwgbGludXggPSAhYW5kcm9pZCAmJiAhc2FpbGZpc2ggJiYgIXRpemVuICYmICF3ZWJvcyAmJiAvbGludXgvaS50ZXN0KHVhKVxuICAgICAgLCBlZGdlVmVyc2lvbiA9IGdldEZpcnN0TWF0Y2goL2VkZ2VcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICAsIHZlcnNpb25JZGVudGlmaWVyID0gZ2V0Rmlyc3RNYXRjaCgvdmVyc2lvblxcLyhcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgICwgdGFibGV0ID0gL3RhYmxldC9pLnRlc3QodWEpXG4gICAgICAsIG1vYmlsZSA9ICF0YWJsZXQgJiYgL1teLV1tb2JpL2kudGVzdCh1YSlcbiAgICAgICwgeGJveCA9IC94Ym94L2kudGVzdCh1YSlcbiAgICAgICwgcmVzdWx0XG5cbiAgICBpZiAoL29wZXJhL2kudGVzdCh1YSkpIHtcbiAgICAgIC8vICBhbiBvbGQgT3BlcmFcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ09wZXJhJ1xuICAgICAgLCBvcGVyYTogdFxuICAgICAgLCB2ZXJzaW9uOiB2ZXJzaW9uSWRlbnRpZmllciB8fCBnZXRGaXJzdE1hdGNoKC8oPzpvcGVyYXxvcHJ8b3Bpb3MpW1xcc1xcL10oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgvb3ByfG9waW9zL2kudGVzdCh1YSkpIHtcbiAgICAgIC8vIGEgbmV3IE9wZXJhXG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdPcGVyYSdcbiAgICAgICAgLCBvcGVyYTogdFxuICAgICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/Om9wcnxvcGlvcylbXFxzXFwvXShcXGQrKFxcLlxcZCspPykvaSkgfHwgdmVyc2lvbklkZW50aWZpZXJcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL1NhbXN1bmdCcm93c2VyL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ1NhbXN1bmcgSW50ZXJuZXQgZm9yIEFuZHJvaWQnXG4gICAgICAgICwgc2Ftc3VuZ0Jyb3dzZXI6IHRcbiAgICAgICAgLCB2ZXJzaW9uOiB2ZXJzaW9uSWRlbnRpZmllciB8fCBnZXRGaXJzdE1hdGNoKC8oPzpTYW1zdW5nQnJvd3NlcilbXFxzXFwvXShcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL2NvYXN0L2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ09wZXJhIENvYXN0J1xuICAgICAgICAsIGNvYXN0OiB0XG4gICAgICAgICwgdmVyc2lvbjogdmVyc2lvbklkZW50aWZpZXIgfHwgZ2V0Rmlyc3RNYXRjaCgvKD86Y29hc3QpW1xcc1xcL10oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC95YWJyb3dzZXIvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnWWFuZGV4IEJyb3dzZXInXG4gICAgICAsIHlhbmRleGJyb3dzZXI6IHRcbiAgICAgICwgdmVyc2lvbjogdmVyc2lvbklkZW50aWZpZXIgfHwgZ2V0Rmlyc3RNYXRjaCgvKD86eWFicm93c2VyKVtcXHNcXC9dKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvdWNicm93c2VyL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICBuYW1lOiAnVUMgQnJvd3NlcidcbiAgICAgICAgLCB1Y2Jyb3dzZXI6IHRcbiAgICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC8oPzp1Y2Jyb3dzZXIpW1xcc1xcL10oXFxkKyg/OlxcLlxcZCspKykvaSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL214aW9zL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ01heHRob24nXG4gICAgICAgICwgbWF4dGhvbjogdFxuICAgICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/Om14aW9zKVtcXHNcXC9dKFxcZCsoPzpcXC5cXGQrKSspL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC9lcGlwaGFueS9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdFcGlwaGFueSdcbiAgICAgICAgLCBlcGlwaGFueTogdFxuICAgICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/OmVwaXBoYW55KVtcXHNcXC9dKFxcZCsoPzpcXC5cXGQrKSspL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC9wdWZmaW4vaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnUHVmZmluJ1xuICAgICAgICAsIHB1ZmZpbjogdFxuICAgICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/OnB1ZmZpbilbXFxzXFwvXShcXGQrKD86XFwuXFxkKyk/KS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvc2xlaXBuaXIvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnU2xlaXBuaXInXG4gICAgICAgICwgc2xlaXBuaXI6IHRcbiAgICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC8oPzpzbGVpcG5pcilbXFxzXFwvXShcXGQrKD86XFwuXFxkKykrKS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvay1tZWxlb24vaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnSy1NZWxlb24nXG4gICAgICAgICwga01lbGVvbjogdFxuICAgICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/OmstbWVsZW9uKVtcXHNcXC9dKFxcZCsoPzpcXC5cXGQrKSspL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHdpbmRvd3NwaG9uZSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnV2luZG93cyBQaG9uZSdcbiAgICAgICwgd2luZG93c3Bob25lOiB0XG4gICAgICB9XG4gICAgICBpZiAoZWRnZVZlcnNpb24pIHtcbiAgICAgICAgcmVzdWx0Lm1zZWRnZSA9IHRcbiAgICAgICAgcmVzdWx0LnZlcnNpb24gPSBlZGdlVmVyc2lvblxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdC5tc2llID0gdFxuICAgICAgICByZXN1bHQudmVyc2lvbiA9IGdldEZpcnN0TWF0Y2goL2llbW9iaWxlXFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvbXNpZXx0cmlkZW50L2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ0ludGVybmV0IEV4cGxvcmVyJ1xuICAgICAgLCBtc2llOiB0XG4gICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/Om1zaWUgfHJ2OikoXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjaHJvbWVvcykge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnQ2hyb21lJ1xuICAgICAgLCBjaHJvbWVvczogdFxuICAgICAgLCBjaHJvbWVCb29rOiB0XG4gICAgICAsIGNocm9tZTogdFxuICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC8oPzpjaHJvbWV8Y3Jpb3N8Y3JtbylcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgvY2hyb21lLis/IGVkZ2UvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnTWljcm9zb2Z0IEVkZ2UnXG4gICAgICAsIG1zZWRnZTogdFxuICAgICAgLCB2ZXJzaW9uOiBlZGdlVmVyc2lvblxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvdml2YWxkaS9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdWaXZhbGRpJ1xuICAgICAgICAsIHZpdmFsZGk6IHRcbiAgICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC92aXZhbGRpXFwvKFxcZCsoXFwuXFxkKyk/KS9pKSB8fCB2ZXJzaW9uSWRlbnRpZmllclxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChzYWlsZmlzaCkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnU2FpbGZpc2gnXG4gICAgICAsIHNhaWxmaXNoOiB0XG4gICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goL3NhaWxmaXNoXFxzP2Jyb3dzZXJcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC9zZWFtb25rZXlcXC8vaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnU2VhTW9ua2V5J1xuICAgICAgLCBzZWFtb25rZXk6IHRcbiAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvc2VhbW9ua2V5XFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvZmlyZWZveHxpY2V3ZWFzZWx8Znhpb3MvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnRmlyZWZveCdcbiAgICAgICwgZmlyZWZveDogdFxuICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC8oPzpmaXJlZm94fGljZXdlYXNlbHxmeGlvcylbIFxcL10oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgICBpZiAoL1xcKChtb2JpbGV8dGFibGV0KTtbXlxcKV0qcnY6W1xcZFxcLl0rXFwpL2kudGVzdCh1YSkpIHtcbiAgICAgICAgcmVzdWx0LmZpcmVmb3hvcyA9IHRcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoc2lsaykge1xuICAgICAgcmVzdWx0ID0gIHtcbiAgICAgICAgbmFtZTogJ0FtYXpvbiBTaWxrJ1xuICAgICAgLCBzaWxrOiB0XG4gICAgICAsIHZlcnNpb24gOiBnZXRGaXJzdE1hdGNoKC9zaWxrXFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvcGhhbnRvbS9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdQaGFudG9tSlMnXG4gICAgICAsIHBoYW50b206IHRcbiAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvcGhhbnRvbWpzXFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvc2xpbWVyanMvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnU2xpbWVySlMnXG4gICAgICAgICwgc2xpbWVyOiB0XG4gICAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvc2xpbWVyanNcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC9ibGFja2JlcnJ5fFxcYmJiXFxkKy9pLnRlc3QodWEpIHx8IC9yaW1cXHN0YWJsZXQvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnQmxhY2tCZXJyeSdcbiAgICAgICwgYmxhY2tiZXJyeTogdFxuICAgICAgLCB2ZXJzaW9uOiB2ZXJzaW9uSWRlbnRpZmllciB8fCBnZXRGaXJzdE1hdGNoKC9ibGFja2JlcnJ5W1xcZF0rXFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh3ZWJvcykge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnV2ViT1MnXG4gICAgICAsIHdlYm9zOiB0XG4gICAgICAsIHZlcnNpb246IHZlcnNpb25JZGVudGlmaWVyIHx8IGdldEZpcnN0TWF0Y2goL3coPzplYik/b3Nicm93c2VyXFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfTtcbiAgICAgIC90b3VjaHBhZFxcLy9pLnRlc3QodWEpICYmIChyZXN1bHQudG91Y2hwYWQgPSB0KVxuICAgIH1cbiAgICBlbHNlIGlmICgvYmFkYS9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdCYWRhJ1xuICAgICAgLCBiYWRhOiB0XG4gICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goL2RvbGZpblxcLyhcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKHRpemVuKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdUaXplbidcbiAgICAgICwgdGl6ZW46IHRcbiAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvKD86dGl6ZW5cXHM/KT9icm93c2VyXFwvKFxcZCsoXFwuXFxkKyk/KS9pKSB8fCB2ZXJzaW9uSWRlbnRpZmllclxuICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoL3F1cHppbGxhL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ1F1cFppbGxhJ1xuICAgICAgICAsIHF1cHppbGxhOiB0XG4gICAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvKD86cXVwemlsbGEpW1xcc1xcL10oXFxkKyg/OlxcLlxcZCspKykvaSkgfHwgdmVyc2lvbklkZW50aWZpZXJcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL2Nocm9taXVtL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ0Nocm9taXVtJ1xuICAgICAgICAsIGNocm9taXVtOiB0XG4gICAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvKD86Y2hyb21pdW0pW1xcc1xcL10oXFxkKyg/OlxcLlxcZCspPykvaSkgfHwgdmVyc2lvbklkZW50aWZpZXJcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL2Nocm9tZXxjcmlvc3xjcm1vL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ0Nocm9tZSdcbiAgICAgICAgLCBjaHJvbWU6IHRcbiAgICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC8oPzpjaHJvbWV8Y3Jpb3N8Y3JtbylcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGFuZHJvaWQpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ0FuZHJvaWQnXG4gICAgICAgICwgdmVyc2lvbjogdmVyc2lvbklkZW50aWZpZXJcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL3NhZmFyaXxhcHBsZXdlYmtpdC9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdTYWZhcmknXG4gICAgICAsIHNhZmFyaTogdFxuICAgICAgfVxuICAgICAgaWYgKHZlcnNpb25JZGVudGlmaWVyKSB7XG4gICAgICAgIHJlc3VsdC52ZXJzaW9uID0gdmVyc2lvbklkZW50aWZpZXJcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaW9zZGV2aWNlKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWUgOiBpb3NkZXZpY2UgPT0gJ2lwaG9uZScgPyAnaVBob25lJyA6IGlvc2RldmljZSA9PSAnaXBhZCcgPyAnaVBhZCcgOiAnaVBvZCdcbiAgICAgIH1cbiAgICAgIC8vIFdURjogdmVyc2lvbiBpcyBub3QgcGFydCBvZiB1c2VyIGFnZW50IGluIHdlYiBhcHBzXG4gICAgICBpZiAodmVyc2lvbklkZW50aWZpZXIpIHtcbiAgICAgICAgcmVzdWx0LnZlcnNpb24gPSB2ZXJzaW9uSWRlbnRpZmllclxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmKC9nb29nbGVib3QvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnR29vZ2xlYm90J1xuICAgICAgLCBnb29nbGVib3Q6IHRcbiAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvZ29vZ2xlYm90XFwvKFxcZCsoXFwuXFxkKykpL2kpIHx8IHZlcnNpb25JZGVudGlmaWVyXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiBnZXRGaXJzdE1hdGNoKC9eKC4qKVxcLyguKikgLyksXG4gICAgICAgIHZlcnNpb246IGdldFNlY29uZE1hdGNoKC9eKC4qKVxcLyguKikgLylcbiAgICAgfTtcbiAgIH1cblxuICAgIC8vIHNldCB3ZWJraXQgb3IgZ2Vja28gZmxhZyBmb3IgYnJvd3NlcnMgYmFzZWQgb24gdGhlc2UgZW5naW5lc1xuICAgIGlmICghcmVzdWx0Lm1zZWRnZSAmJiAvKGFwcGxlKT93ZWJraXQvaS50ZXN0KHVhKSkge1xuICAgICAgaWYgKC8oYXBwbGUpP3dlYmtpdFxcLzUzN1xcLjM2L2kudGVzdCh1YSkpIHtcbiAgICAgICAgcmVzdWx0Lm5hbWUgPSByZXN1bHQubmFtZSB8fCBcIkJsaW5rXCJcbiAgICAgICAgcmVzdWx0LmJsaW5rID0gdFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0Lm5hbWUgPSByZXN1bHQubmFtZSB8fCBcIldlYmtpdFwiXG4gICAgICAgIHJlc3VsdC53ZWJraXQgPSB0XG4gICAgICB9XG4gICAgICBpZiAoIXJlc3VsdC52ZXJzaW9uICYmIHZlcnNpb25JZGVudGlmaWVyKSB7XG4gICAgICAgIHJlc3VsdC52ZXJzaW9uID0gdmVyc2lvbklkZW50aWZpZXJcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFyZXN1bHQub3BlcmEgJiYgL2dlY2tvXFwvL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdC5uYW1lID0gcmVzdWx0Lm5hbWUgfHwgXCJHZWNrb1wiXG4gICAgICByZXN1bHQuZ2Vja28gPSB0XG4gICAgICByZXN1bHQudmVyc2lvbiA9IHJlc3VsdC52ZXJzaW9uIHx8IGdldEZpcnN0TWF0Y2goL2dlY2tvXFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgIH1cblxuICAgIC8vIHNldCBPUyBmbGFncyBmb3IgcGxhdGZvcm1zIHRoYXQgaGF2ZSBtdWx0aXBsZSBicm93c2Vyc1xuICAgIGlmICghcmVzdWx0LndpbmRvd3NwaG9uZSAmJiAhcmVzdWx0Lm1zZWRnZSAmJiAoYW5kcm9pZCB8fCByZXN1bHQuc2lsaykpIHtcbiAgICAgIHJlc3VsdC5hbmRyb2lkID0gdFxuICAgIH0gZWxzZSBpZiAoIXJlc3VsdC53aW5kb3dzcGhvbmUgJiYgIXJlc3VsdC5tc2VkZ2UgJiYgaW9zZGV2aWNlKSB7XG4gICAgICByZXN1bHRbaW9zZGV2aWNlXSA9IHRcbiAgICAgIHJlc3VsdC5pb3MgPSB0XG4gICAgfSBlbHNlIGlmIChtYWMpIHtcbiAgICAgIHJlc3VsdC5tYWMgPSB0XG4gICAgfSBlbHNlIGlmICh4Ym94KSB7XG4gICAgICByZXN1bHQueGJveCA9IHRcbiAgICB9IGVsc2UgaWYgKHdpbmRvd3MpIHtcbiAgICAgIHJlc3VsdC53aW5kb3dzID0gdFxuICAgIH0gZWxzZSBpZiAobGludXgpIHtcbiAgICAgIHJlc3VsdC5saW51eCA9IHRcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRXaW5kb3dzVmVyc2lvbiAocykge1xuICAgICAgc3dpdGNoIChzKSB7XG4gICAgICAgIGNhc2UgJ05UJzogcmV0dXJuICdOVCdcbiAgICAgICAgY2FzZSAnWFAnOiByZXR1cm4gJ1hQJ1xuICAgICAgICBjYXNlICdOVCA1LjAnOiByZXR1cm4gJzIwMDAnXG4gICAgICAgIGNhc2UgJ05UIDUuMSc6IHJldHVybiAnWFAnXG4gICAgICAgIGNhc2UgJ05UIDUuMic6IHJldHVybiAnMjAwMydcbiAgICAgICAgY2FzZSAnTlQgNi4wJzogcmV0dXJuICdWaXN0YSdcbiAgICAgICAgY2FzZSAnTlQgNi4xJzogcmV0dXJuICc3J1xuICAgICAgICBjYXNlICdOVCA2LjInOiByZXR1cm4gJzgnXG4gICAgICAgIGNhc2UgJ05UIDYuMyc6IHJldHVybiAnOC4xJ1xuICAgICAgICBjYXNlICdOVCAxMC4wJzogcmV0dXJuICcxMCdcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBPUyB2ZXJzaW9uIGV4dHJhY3Rpb25cbiAgICB2YXIgb3NWZXJzaW9uID0gJyc7XG4gICAgaWYgKHJlc3VsdC53aW5kb3dzKSB7XG4gICAgICBvc1ZlcnNpb24gPSBnZXRXaW5kb3dzVmVyc2lvbihnZXRGaXJzdE1hdGNoKC9XaW5kb3dzICgoTlR8WFApKCBcXGRcXGQ/LlxcZCk/KS9pKSlcbiAgICB9IGVsc2UgaWYgKHJlc3VsdC53aW5kb3dzcGhvbmUpIHtcbiAgICAgIG9zVmVyc2lvbiA9IGdldEZpcnN0TWF0Y2goL3dpbmRvd3MgcGhvbmUgKD86b3MpP1xccz8oXFxkKyhcXC5cXGQrKSopL2kpO1xuICAgIH0gZWxzZSBpZiAocmVzdWx0Lm1hYykge1xuICAgICAgb3NWZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvTWFjIE9TIFggKFxcZCsoW19cXC5cXHNdXFxkKykqKS9pKTtcbiAgICAgIG9zVmVyc2lvbiA9IG9zVmVyc2lvbi5yZXBsYWNlKC9bX1xcc10vZywgJy4nKTtcbiAgICB9IGVsc2UgaWYgKGlvc2RldmljZSkge1xuICAgICAgb3NWZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvb3MgKFxcZCsoW19cXHNdXFxkKykqKSBsaWtlIG1hYyBvcyB4L2kpO1xuICAgICAgb3NWZXJzaW9uID0gb3NWZXJzaW9uLnJlcGxhY2UoL1tfXFxzXS9nLCAnLicpO1xuICAgIH0gZWxzZSBpZiAoYW5kcm9pZCkge1xuICAgICAgb3NWZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvYW5kcm9pZFsgXFwvLV0oXFxkKyhcXC5cXGQrKSopL2kpO1xuICAgIH0gZWxzZSBpZiAocmVzdWx0LndlYm9zKSB7XG4gICAgICBvc1ZlcnNpb24gPSBnZXRGaXJzdE1hdGNoKC8oPzp3ZWJ8aHB3KW9zXFwvKFxcZCsoXFwuXFxkKykqKS9pKTtcbiAgICB9IGVsc2UgaWYgKHJlc3VsdC5ibGFja2JlcnJ5KSB7XG4gICAgICBvc1ZlcnNpb24gPSBnZXRGaXJzdE1hdGNoKC9yaW1cXHN0YWJsZXRcXHNvc1xccyhcXGQrKFxcLlxcZCspKikvaSk7XG4gICAgfSBlbHNlIGlmIChyZXN1bHQuYmFkYSkge1xuICAgICAgb3NWZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvYmFkYVxcLyhcXGQrKFxcLlxcZCspKikvaSk7XG4gICAgfSBlbHNlIGlmIChyZXN1bHQudGl6ZW4pIHtcbiAgICAgIG9zVmVyc2lvbiA9IGdldEZpcnN0TWF0Y2goL3RpemVuW1xcL1xcc10oXFxkKyhcXC5cXGQrKSopL2kpO1xuICAgIH1cbiAgICBpZiAob3NWZXJzaW9uKSB7XG4gICAgICByZXN1bHQub3N2ZXJzaW9uID0gb3NWZXJzaW9uO1xuICAgIH1cblxuICAgIC8vIGRldmljZSB0eXBlIGV4dHJhY3Rpb25cbiAgICB2YXIgb3NNYWpvclZlcnNpb24gPSAhcmVzdWx0LndpbmRvd3MgJiYgb3NWZXJzaW9uLnNwbGl0KCcuJylbMF07XG4gICAgaWYgKFxuICAgICAgICAgdGFibGV0XG4gICAgICB8fCBuZXh1c1RhYmxldFxuICAgICAgfHwgaW9zZGV2aWNlID09ICdpcGFkJ1xuICAgICAgfHwgKGFuZHJvaWQgJiYgKG9zTWFqb3JWZXJzaW9uID09IDMgfHwgKG9zTWFqb3JWZXJzaW9uID49IDQgJiYgIW1vYmlsZSkpKVxuICAgICAgfHwgcmVzdWx0LnNpbGtcbiAgICApIHtcbiAgICAgIHJlc3VsdC50YWJsZXQgPSB0XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICAgIG1vYmlsZVxuICAgICAgfHwgaW9zZGV2aWNlID09ICdpcGhvbmUnXG4gICAgICB8fCBpb3NkZXZpY2UgPT0gJ2lwb2QnXG4gICAgICB8fCBhbmRyb2lkXG4gICAgICB8fCBuZXh1c01vYmlsZVxuICAgICAgfHwgcmVzdWx0LmJsYWNrYmVycnlcbiAgICAgIHx8IHJlc3VsdC53ZWJvc1xuICAgICAgfHwgcmVzdWx0LmJhZGFcbiAgICApIHtcbiAgICAgIHJlc3VsdC5tb2JpbGUgPSB0XG4gICAgfVxuXG4gICAgLy8gR3JhZGVkIEJyb3dzZXIgU3VwcG9ydFxuICAgIC8vIGh0dHA6Ly9kZXZlbG9wZXIueWFob28uY29tL3l1aS9hcnRpY2xlcy9nYnNcbiAgICBpZiAocmVzdWx0Lm1zZWRnZSB8fFxuICAgICAgICAocmVzdWx0Lm1zaWUgJiYgcmVzdWx0LnZlcnNpb24gPj0gMTApIHx8XG4gICAgICAgIChyZXN1bHQueWFuZGV4YnJvd3NlciAmJiByZXN1bHQudmVyc2lvbiA+PSAxNSkgfHxcblx0XHQgICAgKHJlc3VsdC52aXZhbGRpICYmIHJlc3VsdC52ZXJzaW9uID49IDEuMCkgfHxcbiAgICAgICAgKHJlc3VsdC5jaHJvbWUgJiYgcmVzdWx0LnZlcnNpb24gPj0gMjApIHx8XG4gICAgICAgIChyZXN1bHQuc2Ftc3VuZ0Jyb3dzZXIgJiYgcmVzdWx0LnZlcnNpb24gPj0gNCkgfHxcbiAgICAgICAgKHJlc3VsdC5maXJlZm94ICYmIHJlc3VsdC52ZXJzaW9uID49IDIwLjApIHx8XG4gICAgICAgIChyZXN1bHQuc2FmYXJpICYmIHJlc3VsdC52ZXJzaW9uID49IDYpIHx8XG4gICAgICAgIChyZXN1bHQub3BlcmEgJiYgcmVzdWx0LnZlcnNpb24gPj0gMTAuMCkgfHxcbiAgICAgICAgKHJlc3VsdC5pb3MgJiYgcmVzdWx0Lm9zdmVyc2lvbiAmJiByZXN1bHQub3N2ZXJzaW9uLnNwbGl0KFwiLlwiKVswXSA+PSA2KSB8fFxuICAgICAgICAocmVzdWx0LmJsYWNrYmVycnkgJiYgcmVzdWx0LnZlcnNpb24gPj0gMTAuMSlcbiAgICAgICAgfHwgKHJlc3VsdC5jaHJvbWl1bSAmJiByZXN1bHQudmVyc2lvbiA+PSAyMClcbiAgICAgICAgKSB7XG4gICAgICByZXN1bHQuYSA9IHQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKChyZXN1bHQubXNpZSAmJiByZXN1bHQudmVyc2lvbiA8IDEwKSB8fFxuICAgICAgICAocmVzdWx0LmNocm9tZSAmJiByZXN1bHQudmVyc2lvbiA8IDIwKSB8fFxuICAgICAgICAocmVzdWx0LmZpcmVmb3ggJiYgcmVzdWx0LnZlcnNpb24gPCAyMC4wKSB8fFxuICAgICAgICAocmVzdWx0LnNhZmFyaSAmJiByZXN1bHQudmVyc2lvbiA8IDYpIHx8XG4gICAgICAgIChyZXN1bHQub3BlcmEgJiYgcmVzdWx0LnZlcnNpb24gPCAxMC4wKSB8fFxuICAgICAgICAocmVzdWx0LmlvcyAmJiByZXN1bHQub3N2ZXJzaW9uICYmIHJlc3VsdC5vc3ZlcnNpb24uc3BsaXQoXCIuXCIpWzBdIDwgNilcbiAgICAgICAgfHwgKHJlc3VsdC5jaHJvbWl1bSAmJiByZXN1bHQudmVyc2lvbiA8IDIwKVxuICAgICAgICApIHtcbiAgICAgIHJlc3VsdC5jID0gdFxuICAgIH0gZWxzZSByZXN1bHQueCA9IHRcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIHZhciBib3dzZXIgPSBkZXRlY3QodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgPyBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnIDogJycpXG5cbiAgYm93c2VyLnRlc3QgPSBmdW5jdGlvbiAoYnJvd3Nlckxpc3QpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJyb3dzZXJMaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgYnJvd3Nlckl0ZW0gPSBicm93c2VyTGlzdFtpXTtcbiAgICAgIGlmICh0eXBlb2YgYnJvd3Nlckl0ZW09PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKGJyb3dzZXJJdGVtIGluIGJvd3Nlcikge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdmVyc2lvbiBwcmVjaXNpb25zIGNvdW50XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqICAgZ2V0VmVyc2lvblByZWNpc2lvbihcIjEuMTAuM1wiKSAvLyAzXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdmVyc2lvblxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRWZXJzaW9uUHJlY2lzaW9uKHZlcnNpb24pIHtcbiAgICByZXR1cm4gdmVyc2lvbi5zcGxpdChcIi5cIikubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIEFycmF5OjptYXAgcG9seWZpbGxcbiAgICpcbiAgICogQHBhcmFtICB7QXJyYXl9IGFyclxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gaXRlcmF0b3JcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuICBmdW5jdGlvbiBtYXAoYXJyLCBpdGVyYXRvcikge1xuICAgIHZhciByZXN1bHQgPSBbXSwgaTtcbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLm1hcCkge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChhcnIsIGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0LnB1c2goaXRlcmF0b3IoYXJyW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIGJyb3dzZXIgdmVyc2lvbiB3ZWlnaHRcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogICBjb21wYXJlVmVyc2lvbnMoWycxLjEwLjIuMScsICAnMS44LjIuMS45MCddKSAgICAvLyAxXG4gICAqICAgY29tcGFyZVZlcnNpb25zKFsnMS4wMTAuMi4xJywgJzEuMDkuMi4xLjkwJ10pOyAgLy8gMVxuICAgKiAgIGNvbXBhcmVWZXJzaW9ucyhbJzEuMTAuMi4xJywgICcxLjEwLjIuMSddKTsgICAgIC8vIDBcbiAgICogICBjb21wYXJlVmVyc2lvbnMoWycxLjEwLjIuMScsICAnMS4wODAwLjInXSk7ICAgICAvLyAtMVxuICAgKlxuICAgKiBAcGFyYW0gIHtBcnJheTxTdHJpbmc+fSB2ZXJzaW9ucyB2ZXJzaW9ucyB0byBjb21wYXJlXG4gICAqIEByZXR1cm4ge051bWJlcn0gY29tcGFyaXNvbiByZXN1bHRcbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBhcmVWZXJzaW9ucyh2ZXJzaW9ucykge1xuICAgIC8vIDEpIGdldCBjb21tb24gcHJlY2lzaW9uIGZvciBib3RoIHZlcnNpb25zLCBmb3IgZXhhbXBsZSBmb3IgXCIxMC4wXCIgYW5kIFwiOVwiIGl0IHNob3VsZCBiZSAyXG4gICAgdmFyIHByZWNpc2lvbiA9IE1hdGgubWF4KGdldFZlcnNpb25QcmVjaXNpb24odmVyc2lvbnNbMF0pLCBnZXRWZXJzaW9uUHJlY2lzaW9uKHZlcnNpb25zWzFdKSk7XG4gICAgdmFyIGNodW5rcyA9IG1hcCh2ZXJzaW9ucywgZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICAgIHZhciBkZWx0YSA9IHByZWNpc2lvbiAtIGdldFZlcnNpb25QcmVjaXNpb24odmVyc2lvbik7XG5cbiAgICAgIC8vIDIpIFwiOVwiIC0+IFwiOS4wXCIgKGZvciBwcmVjaXNpb24gPSAyKVxuICAgICAgdmVyc2lvbiA9IHZlcnNpb24gKyBuZXcgQXJyYXkoZGVsdGEgKyAxKS5qb2luKFwiLjBcIik7XG5cbiAgICAgIC8vIDMpIFwiOS4wXCIgLT4gW1wiMDAwMDAwMDAwXCJcIiwgXCIwMDAwMDAwMDlcIl1cbiAgICAgIHJldHVybiBtYXAodmVyc2lvbi5zcGxpdChcIi5cIiksIGZ1bmN0aW9uIChjaHVuaykge1xuICAgICAgICByZXR1cm4gbmV3IEFycmF5KDIwIC0gY2h1bmsubGVuZ3RoKS5qb2luKFwiMFwiKSArIGNodW5rO1xuICAgICAgfSkucmV2ZXJzZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gaXRlcmF0ZSBpbiByZXZlcnNlIG9yZGVyIGJ5IHJldmVyc2VkIGNodW5rcyBhcnJheVxuICAgIHdoaWxlICgtLXByZWNpc2lvbiA+PSAwKSB7XG4gICAgICAvLyA0KSBjb21wYXJlOiBcIjAwMDAwMDAwOVwiID4gXCIwMDAwMDAwMTBcIiA9IGZhbHNlIChidXQgXCI5XCIgPiBcIjEwXCIgPSB0cnVlKVxuICAgICAgaWYgKGNodW5rc1swXVtwcmVjaXNpb25dID4gY2h1bmtzWzFdW3ByZWNpc2lvbl0pIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChjaHVua3NbMF1bcHJlY2lzaW9uXSA9PT0gY2h1bmtzWzFdW3ByZWNpc2lvbl0pIHtcbiAgICAgICAgaWYgKHByZWNpc2lvbiA9PT0gMCkge1xuICAgICAgICAgIC8vIGFsbCB2ZXJzaW9uIGNodW5rcyBhcmUgc2FtZVxuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBicm93c2VyIGlzIHVuc3VwcG9ydGVkXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqICAgYm93c2VyLmlzVW5zdXBwb3J0ZWRCcm93c2VyKHtcbiAgICogICAgIG1zaWU6IFwiMTBcIixcbiAgICogICAgIGZpcmVmb3g6IFwiMjNcIixcbiAgICogICAgIGNocm9tZTogXCIyOVwiLFxuICAgKiAgICAgc2FmYXJpOiBcIjUuMVwiLFxuICAgKiAgICAgb3BlcmE6IFwiMTZcIixcbiAgICogICAgIHBoYW50b206IFwiNTM0XCJcbiAgICogICB9KTtcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgbWluVmVyc2lvbnMgbWFwIG9mIG1pbmltYWwgdmVyc2lvbiB0byBicm93c2VyXG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IFtzdHJpY3RNb2RlID0gZmFsc2VdIGZsYWcgdG8gcmV0dXJuIGZhbHNlIGlmIGJyb3dzZXIgd2Fzbid0IGZvdW5kIGluIG1hcFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBbdWFdIHVzZXIgYWdlbnQgc3RyaW5nXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBpc1Vuc3VwcG9ydGVkQnJvd3NlcihtaW5WZXJzaW9ucywgc3RyaWN0TW9kZSwgdWEpIHtcbiAgICB2YXIgX2Jvd3NlciA9IGJvd3NlcjtcblxuICAgIC8vIG1ha2Ugc3RyaWN0TW9kZSBwYXJhbSBvcHRpb25hbCB3aXRoIHVhIHBhcmFtIHVzYWdlXG4gICAgaWYgKHR5cGVvZiBzdHJpY3RNb2RlID09PSAnc3RyaW5nJykge1xuICAgICAgdWEgPSBzdHJpY3RNb2RlO1xuICAgICAgc3RyaWN0TW9kZSA9IHZvaWQoMCk7XG4gICAgfVxuXG4gICAgaWYgKHN0cmljdE1vZGUgPT09IHZvaWQoMCkpIHtcbiAgICAgIHN0cmljdE1vZGUgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHVhKSB7XG4gICAgICBfYm93c2VyID0gZGV0ZWN0KHVhKTtcbiAgICB9XG5cbiAgICB2YXIgdmVyc2lvbiA9IFwiXCIgKyBfYm93c2VyLnZlcnNpb247XG4gICAgZm9yICh2YXIgYnJvd3NlciBpbiBtaW5WZXJzaW9ucykge1xuICAgICAgaWYgKG1pblZlcnNpb25zLmhhc093blByb3BlcnR5KGJyb3dzZXIpKSB7XG4gICAgICAgIGlmIChfYm93c2VyW2Jyb3dzZXJdKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBtaW5WZXJzaW9uc1ticm93c2VyXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQnJvd3NlciB2ZXJzaW9uIGluIHRoZSBtaW5WZXJzaW9uIG1hcCBzaG91bGQgYmUgYSBzdHJpbmc6ICcgKyBicm93c2VyICsgJzogJyArIFN0cmluZyhtaW5WZXJzaW9ucykpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGJyb3dzZXIgdmVyc2lvbiBhbmQgbWluIHN1cHBvcnRlZCB2ZXJzaW9uLlxuICAgICAgICAgIHJldHVybiBjb21wYXJlVmVyc2lvbnMoW3ZlcnNpb24sIG1pblZlcnNpb25zW2Jyb3dzZXJdXSkgPCAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmljdE1vZGU7IC8vIG5vdCBmb3VuZFxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGJyb3dzZXIgaXMgc3VwcG9ydGVkXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gbWluVmVyc2lvbnMgbWFwIG9mIG1pbmltYWwgdmVyc2lvbiB0byBicm93c2VyXG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IFtzdHJpY3RNb2RlID0gZmFsc2VdIGZsYWcgdG8gcmV0dXJuIGZhbHNlIGlmIGJyb3dzZXIgd2Fzbid0IGZvdW5kIGluIG1hcFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBbdWFdIHVzZXIgYWdlbnQgc3RyaW5nXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBjaGVjayhtaW5WZXJzaW9ucywgc3RyaWN0TW9kZSwgdWEpIHtcbiAgICByZXR1cm4gIWlzVW5zdXBwb3J0ZWRCcm93c2VyKG1pblZlcnNpb25zLCBzdHJpY3RNb2RlLCB1YSk7XG4gIH1cblxuICBib3dzZXIuaXNVbnN1cHBvcnRlZEJyb3dzZXIgPSBpc1Vuc3VwcG9ydGVkQnJvd3NlcjtcbiAgYm93c2VyLmNvbXBhcmVWZXJzaW9ucyA9IGNvbXBhcmVWZXJzaW9ucztcbiAgYm93c2VyLmNoZWNrID0gY2hlY2s7XG5cbiAgLypcbiAgICogU2V0IG91ciBkZXRlY3QgbWV0aG9kIHRvIHRoZSBtYWluIGJvd3NlciBvYmplY3Qgc28gd2UgY2FuXG4gICAqIHJldXNlIGl0IHRvIHRlc3Qgb3RoZXIgdXNlciBhZ2VudHMuXG4gICAqIFRoaXMgaXMgbmVlZGVkIHRvIGltcGxlbWVudCBmdXR1cmUgdGVzdHMuXG4gICAqL1xuICBib3dzZXIuX2RldGVjdCA9IGRldGVjdDtcblxuICByZXR1cm4gYm93c2VyXG59KTtcbiIsImltcG9ydCBBbGVydENvbXBvbmVudCBmcm9tIFwiLi9vdmgtYW5ndWxhci1icm93c2VyLWFsZXJ0LmNvbXBvbmVudFwiO1xuaW1wb3J0IEFsZXJ0U2VydmljZSBmcm9tIFwiLi9vdmgtYW5ndWxhci1icm93c2VyLWFsZXJ0LnNlcnZpY2VcIjtcblxuYW5ndWxhci5tb2R1bGUoXCJvdmhCcm93c2VyQWxlcnRcIiwgW10pXG4gICAgLnNlcnZpY2UoXCJicm93c2VyQWxlcnRTZXJ2aWNlXCIsIEFsZXJ0U2VydmljZSlcbiAgICAuY29tcG9uZW50KFwib3ZoQnJvd3NlckFsZXJ0XCIsIEFsZXJ0Q29tcG9uZW50KTtcbiIsImltcG9ydCBjb250cm9sbGVyIGZyb20gXCIuL292aC1hbmd1bGFyLWJyb3dzZXItYWxlcnQuY29udHJvbGxlclwiO1xuaW1wb3J0IHRlbXBsYXRlIGZyb20gXCIuL292aC1hbmd1bGFyLWJyb3dzZXItYWxlcnQuaHRtbFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgdGVtcGxhdGUsXG4gICAgY29udHJvbGxlclxufTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvciAoJHNjb3BlLCBicm93c2VyQWxlcnRTZXJ2aWNlKSB7XG4gICAgICAgIFwibmdJbmplY3RcIjtcblxuICAgICAgICB0aGlzLmFsZXJ0U3ZjID0gYnJvd3NlckFsZXJ0U2VydmljZTtcbiAgICAgICAgdGhpcy4kc2NvcGUgPSAkc2NvcGU7XG5cbiAgICAgICAgdGhpcy4kc2NvcGUuaXNTdXBwb3J0ZWQgPSB0aGlzLmFsZXJ0U3ZjLmlzU3VwcG9ydGVkKCk7XG4gICAgICAgIHRoaXMuJHNjb3BlLmlzRGVwcmVjYXRlZCA9IHRoaXMuYWxlcnRTdmMuaXNEZXByZWNhdGVkKCk7XG4gICAgfVxuXG4gICAgZGlzbWlzc0FsZXJ0ICgpIHtcbiAgICAgICAgdGhpcy4kc2NvcGUuaXNEaXNtaXNzZWQgPSB0cnVlO1xuICAgIH1cbn1cbiIsImltcG9ydCBib3dzZXIgZnJvbSBcImJvd3NlclwiO1xuaW1wb3J0IGJyb3dzZXJzIGZyb20gXCIuL3N1cHBvcnRlZF9icm93c2Vycy5qc29uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBpc1N1cHBvcnRlZCAoKSB7XG4gICAgICAgIHJldHVybiBib3dzZXIuY2hlY2soYnJvd3NlcnMudW5zdXBwb3J0ZWQpO1xuICAgIH1cblxuICAgIGlzRGVwcmVjYXRlZCAoKSB7XG4gICAgICAgIHJldHVybiAhYm93c2VyLmNoZWNrKGJyb3dzZXJzLmRlcHJlY2F0ZWQpO1xuICAgIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzPXtcbiAgLy8gTGlzdCBvZiBicm93c2VycyBrZXlzIGh0dHBzOi8vZ2l0aHViLmNvbS9sYW5jZWRpa3Nvbi9ib3dzZXIvYmxvYi9tYXN0ZXIvUkVBRE1FLm1kXG4gIC8vIE1pbmltdW0gdmVyc2lvbnMgOlxuICBcImRlcHJlY2F0ZWRcIjoge1xuICAgIFwiZmlyZWZveFwiOiBcIjUyXCIsXG4gICAgXCJjaHJvbWVcIjogXCI1OFwiLFxuICAgIFwibXNpZVwiOiBcIjExXCIsXG4gICAgXCJtc2VkZ2VcIjogXCIxNFwiLFxuICAgIFwic2FmYXJpXCI6IFwiOVwiLFxuICAgIFwib3BlcmFcIjogXCI0NFwiXG4gIH0sXG4gIFwidW5zdXBwb3J0ZWRcIjoge1xuICAgIFwiZmlyZWZveFwiOiBcIjQ1XCIsXG4gICAgXCJjaHJvbWVcIjogXCI1MVwiLFxuICAgIFwibXNpZVwiOiBcIjEwXCIsXG4gICAgXCJtc2VkZ2VcIjogXCIxMlwiLFxuICAgIFwic2FmYXJpXCI6IFwiOFwiLFxuICAgIFwib3BlcmFcIjogXCIzN1wiXG4gIH1cbn1cbiJdfQ==
