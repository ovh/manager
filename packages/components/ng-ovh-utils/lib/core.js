/*----JSHINT Options----*/
/*jshint regexdash:true*/
/*Start coding*/

(function () {
    "use strict";

    var cookies,
        local, dLocal,
        i,
        cookie,
        cookieName = null,
        csidRegExp = new RegExp(/(.+\.html).*(\?|&)csid=([A-Za-z0-9]*).*/),
        csid = window.location.href.match(csidRegExp) ? window.location.href.replace(csidRegExp, '$3') : null;

    if (!!csid) {
        if (window.sessionStorage) {
            local = window.sessionStorage.getItem('univers-selected-language-' + csid);
        } else {
            cookieName = 'univers-select-language-' + csid;
        }
    } else {

        if (!window.localStorage) {
            cookieName = 'univers-selected-language';
        } else {
            local = window.localStorage.getItem('univers-selected-language');
        }
    }

    if (!cookieName && !local) {
        dLocal = window.localStorage.getItem('univers-selected-language');
    }

    if (!!cookieName) {
        cookies = document.cookie || '';
        cookies = cookies.split(';');

        i = cookies.length;

        for ( i ; --i ;) {
            cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            cookie = cookies[i].split('=');
            if (cookie[0] === cookieName) {
                local = cookie[1];
                break;
            } else if (cookie[0] === 'universe-selected-language') {
                dLocal = cookie[1];
            }
        }
    }

    if(!local) {
        if (!!dLocal) {
            local = dLocal.replace('_', '-').toLowerCase();
        }
    } else {
        local = local.replace('_', '-').toLowerCase();
    }

    if (!!local) {
        document.write('<script type="text/javascript" src="resources/angular/i18n/angular-locale_' + local +'.js"></script>');
    }

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    if (!String.prototype.capitalize) {
        String.prototype.capitalize = function () {
            return this.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
                return p1 + p2.toUpperCase();
            });
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            if (this === null || this === undefined) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n !== n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }

    //put this int a service please !
    if (typeof $ !== 'undefined') {
        $.extend({
            // return array of object keys
            'keys': function (obj) {
                var a = [];
                $.each(obj, function (k) {
                    a.push(k);
                });
                return a;
            },
            // count object keys
            'count': function (obj) {
                var i = 0;
                $.each(obj, function () {
                    i++;
                });
                return i;
            },
            // return array of object values
            'values': function (obj) {
                var a = [];
                $.each(obj, function (k, v) {
                    a.push(v);
                });
                return a;
            },
            // duplicate an object
            'copy': function (obj) {
                var c = {};
                $.extend(c, obj);
                return c;
            },
            // check siret number validity
            'isValidSiret': function (siret) {
                var mySiret = siret.replace(/\D|\s|\t|\r/g, '') + '';
                if (mySiret.length === 14) {
                    var siretCount = [];
                    for (var i = 0; i !== mySiret.length; i++) {
                        var value = 0;
                        if (i % 2 === 0) {
                            value = parseInt(mySiret.charAt(i), 10) * 2;
                            if (value >= 10) {
                                value -= 9;
                            }
                        } else {
                            value = parseInt(mySiret.charAt(i), 10);
                        }
                        siretCount.push(value);
                    }
                    if (array_sum(siretCount) % 10 === 0) {
                        return true;
                    }
                }
                return false;
            },
            // Check if a String is empty (""), null or undefined
            'isEmpty': function (str) {
                return str === null || str === undefined || str === "";
            },
            'delay': function (millis, callback) {
                setTimeout(callback, millis);
            },
            'getUrlParam': function (n) {
                var s = window.location.search,
                    a, v;

                if (!$.isEmpty(s)) {
                    a = s.substr(1, s.length).split('&');
                    for (v in a) {
                        if (a.hasOwnProperty(v)) {
                            if (a[v].split("=")[0] === n) {
                                return a[v].split("=")[1] || "";
                            }
                        }
                    }
                }
                return null;
            },
            'search': function (obj, key) {
                var subObj = obj;
                var keyTree = key.split('.');
                for (var i in keyTree) {
                    if (subObj[keyTree[i]]) {
                        subObj = subObj[keyTree[i]];
                    } else {
                        return undefined;
                    }
                }
                return subObj;
            }
        });
    }
})();
