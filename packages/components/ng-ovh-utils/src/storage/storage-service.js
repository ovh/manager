/**
 * @type service
 * @name ovhServices:storage
 * @description
 * provide localstorage and polyfill
 * @example
 * # Usage
 * Javascript view controller :
 * <code:js>
 * angular.module('app', []).run(['storage', function (storage) {
 *      storage.setKeyPrefix('MON_UNIVERS');
 * });
 * function controller ($scope, storage) {
 *      $scope.get = function () {
 *          storage.add('scope');
 *      };
 *
 *      $scope.set = function () {
 *          storage.set('scope', $scope)
 *      };
 *
 *      $scope.remove = function () {
 *          storage.remove('scope', $scope);
 *      };
 * }
 * controller.$inject = ['$scope', 'storage'];
 * </code>
 */
export default function () {
  // polyfill
  if (!window.localStorage || !window.sessionStorage) {
    (function () {
      const Storage = function (type) {
        let data;
        const hoursInMilli = 24 * 60 * 60 * 1000;

        function createCookie(name, value, days) {
          let date;
          let expires;
          if (days) {
            date = new Date();
            date.setTime(date.getTime() + days * hoursInMilli);
            expires = `; expires=${date.toGMTString()}`;
          } else {
            expires = '';
          }
          document.cookie = `${name}=${value}${expires}; path=/`;
        }

        function readCookie(name) {
          const nameEQ = `${name}=`;

          const ca = document.cookie.split(';');

          let i;

          let c;

          for (i = 0; i < ca.length; i += 1) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
              c = c.substring(1, c.length);
            }

            if (c.indexOf(nameEQ) === 0) {
              return c.substring(nameEQ.length, c.length);
            }
          }
          return null;
        }

        function setData(dataParam) {
          const lsdata = JSON.stringify(dataParam);
          if (type === 'session') {
            createCookie('localStorage', lsdata);
          } else {
            createCookie('localStorage', lsdata, 365);
          }
        }

        function clearData() {
          if (type === 'session') {
            createCookie('localStorage', '');
          } else {
            createCookie('localStorage', '', 365);
          }
        }

        function getData() {
          const lsdata = type === 'session' ? window.name : readCookie('localStorage');
          return lsdata ? JSON.parse(lsdata) : {};
        }

        data = getData();

        function numKeys() {
          let n = 0;
          let k;
          /* eslint-disable */
          for (k in data) {
            if (data.hasOwnProperty(k)) {
              n += 1;
            }
          }
          /* eslint-enable */
          return n;
        }

        return {
          clear() {
            data = {};
            clearData();
            this.length = numKeys();
          },
          getItem(keyParam) {
            const key = encodeURIComponent(keyParam);
            return data[key] === undefined ? null : data[key];
          },
          key(i) {
            let ctr = 0;
            let k;
            /* eslint-disable */
            for (k in data) {
              if (ctr === i) {
                return decodeURIComponent(k);
              }
              ctr++;
            }
            /* eslint-enable */
            return null;
          },
          removeItem(keyParam) {
            const key = encodeURIComponent(keyParam);
            delete data[key];
            setData(data);
            this.length = numKeys();
          },
          setItem(keyParam, value) {
            const key = encodeURIComponent(keyParam);
            data[key] = String(value);
            setData(data);
            this.length = numKeys();
          },
          length: 0,
        };
      };

      if (!window.localStorage) {
        window.localStorage = new Storage('local');
      }

      if (!window.sessionStorage) {
        window.sessionStorage = new Storage('session');
      }
    }());
  }

  let kp = '';

  const self = this;

  /**
   * @type function
   * @name ovhServices:storage.setKeyPrefix
   * @description
   * set the prefix for your storage keys
   * @param {string} prefix the prefix keys
   * @return {storage} this
   */
  this.setKeyPrefix = function (prefix) {
    if (typeof prefix === 'string') {
      kp = prefix;
    }
    return self;
  };
  /**
   * @type function
   * @name ovhServices:storage.add
   * @description
   * add an entry into storage
   * @param {string} key the prefix id
   * @param {value} value the value to set
   * @param {boolean} isSession sessionStorage or not
   * @return {storage} this
   */
  this.add = function (key, value, isSession) {
    if (key !== undefined && value !== undefined) {
      if (!isSession) {
        window.localStorage.setItem(kp + key, value);
      } else {
        window.sessionStorage.setItem(kp + key, value);
      }
    }
    return self;
  };
  /**
   * @type function
   * @name ovhServices:storage.remove
   * @description
   * set the prefix for your storage keys
   * @param {string} key the id of the value you want to remove
   * @param {boolean} isSession sessionStorage or not
   * @return {storage} this
   */
  this.remove = function (key, isSession) {
    if (key !== undefined) {
      if (isSession) {
        window.sessionStorage.removeItem(kp + key);
      } else {
        window.localStorage.removeItem(kp + key);
      }
    }
    return self;
  };
  /**
   * @type function
   * @name ovhServices:storage.get
   * @description
   * set the prefix for your storage keys
   * @param {string} key the prefix keys
   * @param {boolean} isSession sessionStorage or not
   * @return {object} the stored value
   */
  this.get = function (key, isSession) {
    if (key !== undefined) {
      if (isSession) {
        return window.sessionStorage.getItem(kp + key);
      }
      return window.localStorage.getItem(kp + key);
    }
    return undefined;
  };
}
