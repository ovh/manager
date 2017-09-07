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
angular.module('ua.storage').service('storage', [function () {
    "use strict";
    // polyfill
    if (!window.localStorage || !window.sessionStorage) {
        (function () {
            var Storage = function (type) {
                var data, hoursInMilli = 24 * 60 * 60 * 1000;

                function createCookie (name, value, days) {
                    var date, expires;
                    if (days) {
                        date = new Date();
                        date.setTime(date.getTime() + (days * hoursInMilli));
                        expires = "; expires=" + date.toGMTString();
                    } else {
                        expires = "";
                    }
                    document.cookie = name + "=" + value + expires + "; path=/";
                }

                function readCookie (name) {
                    var nameEQ = name + "=",
                        ca = document.cookie.split(';'),
                        i, c;

                    for (i = 0; i < ca.length; i++) {
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

                function setData (data) {
                    data = JSON.stringify(data);
                    if (type === 'session') {
                        createCookie('localStorage', data);
                    } else {
                        createCookie('localStorage', data, 365);
                    }
                }

                function clearData () {
                    if (type === 'session') {
                        createCookie('localStorage', '');
                    } else {
                        createCookie('localStorage', '', 365);
                    }
                }

                function getData () {
                    var data = type === 'session' ? window.name : readCookie('localStorage');
                    return data ? JSON.parse(data) : {};
                }

                data = getData ();

                function numKeys () {
                    var n = 0, k;
                    for (k in data) {
                        if (data.hasOwnProperty(k)) {
                            n += 1;
                        }
                    }
                    return n;
                }

                return {
                    clear: function () {
                        data = {};
                        clearData();
                        this.length = numKeys();
                    },
                    getItem: function (key) {
                        key = encodeURIComponent(key);
                        return data[key] === undefined ? null : data[key];
                    },
                    key: function (i) {
                        var ctr = 0, k;
                        for (k in data) {
                            if (ctr === i) {
                                return decodeURIComponent(k);
                            } else {
                                ctr++;
                            }
                        }
                        return null;
                    },
                    removeItem: function (key) {
                        key = encodeURIComponent(key);
                        delete data[key];
                        setData(data);
                        this.length = numKeys();
                    },
                    setItem: function (key, value) {
                        key = encodeURIComponent(key);
                        data[key] = String(value);
                        setData(data);
                        this.length = numKeys();
                    },
                    length: 0
                };
            };

            if (!window.localStorage) {
                window.localStorage = new Storage('local');
            }

            if (!window.sessionStorage) {
                window.sessionStorage = new Storage('session');
            }

        })();
    }

    var kp = '',
        self = this;

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
            } else {
                return window.localStorage.getItem(kp + key);
            }
        }
        return undefined;
    };

}]);
