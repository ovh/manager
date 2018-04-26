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

angular.module('ua.agreements', []);

angular.module('ua.alerter', []);

angular.module('ua.clickRoute', []);

angular.module('ua.contracts', []);

angular.module('ua.dateTimePicker', []).constant('ovhDirectives.constant.dateTimePicker.VIEW_MODE', {
    days  : 0,
    day   : 0,
    d     : 0,
    months: 1,
    month : 1,
    m     : 1,
    years : 2,
    year  : 2,
    y     : 2,
    //for retro compat
    0     : 0,
    1     : 1,
    2     : 2
}).constant('ovhDirectives.constant.dateTimePicker.CONFIG_OPTIONS', [ //available config for directive
    'format',
    'type',
    'modelTimezone',
    'weekStart',
    'calendarWeeks',
    'startDate',
    'endDate',
    'daysOfWeekDisabled',
    'autoclose',
    'startView',
    'minViewMode',
    'todayBtn',
    'todayHighlight',
    'keyboardNavigation',
    'language',
    'forceParse',
    'placement',
    'maskInput',
    'pickDate',
    'pickTime',
    'pick12HourFormat',
    'pickSeconds',
    'collapse'
]);

angular.module('ua.elasticArea', []);

angular.module('ua.event', []);

angular.module('ua.extendedAccordion', []);

angular.module('ua.flexTable', []);

angular.module('ua.grid', []);

angular.module('ua.highlight', []);

angular.module('ua.httpInterceptor', []);

angular.module('ua.humanReadableSize', []);

angular.module('ua.i18n', []);

angular.module('ua.ignoreSpaces', []);

angular.module('ua.inputNumber', []);

angular.module('ua.logger', []);

angular.module('ua.moment', []);

angular.module('ua.navigator', []);

angular.module('ua.paginationServerSide', []);

angular.module('ua.poll', []);

angular.module('ua.popover', []);

angular.module('ua.preserveScroll', []);

angular.module('ua.price', []);

angular.module('ua.sessionFetcher', []);

angular.module('ua.sessionTimeout', []);

angular.module('ua.stargate', []);

angular.module('ua.step', []);

angular.module('ua.storage', []);

angular.module('ua.substring', []);

angular.module('ua.timePicker', []);

angular.module('ua.tooltipBox', []).constant('ovhDirectives.constant.tooltipBox.CONFIG_OPTIONS', [
    'container',
    'selector',
    'title',
    'contentText',
    'contentTemplate',
    'placement',
    'animation',
    'unique',
    'html',
    'trigger',
    'delay',
    'hideOnBlur'
]);

angular.module('ua.translator', []).run(function () {
    "use strict";
    $.ajaxPrefilter(function (options, originalOptions) {
        if (options.dataType === 'script' || originalOptions.dataType === 'script') {
            options.cache = true;
        }
    });
}).constant('AVAILABLE_LANGUAGE', [
    { value: "de_DE", name: "Deutsch" },
    { value: "en_GB", name: "English" },
    { value: "es_ES", name: "Español" },
    { value: "fr_FR", name: "Français" },
    { value: "it_IT", name: "Italiano" },
    { value: "lt_LT", name: "Lietuviškai" },
    { value: "nl_NL", name: "Nederlands" },
    { value: "pl_PL", name: "Polski" },
    { value: "pt_PT", name: "Português" },
    { value: "sk_SK", name: "Slovakian" },
    { value: "fi_FI", name: "Suomi" },
    { value: "cs_CZ", name: "Česky" }
]);

angular.module('ua.triStateCheckbox', []);

angular.module('ua.typeOff', []);

angular.module('ua.wizard', []);

angular.module('ua.wizardForm', []);

/**
 * @type directive
 * @name ovhDirectives:agreements
 * @version 0.0.1
 * @description
 * provide a pagination for contract
 * # Usage
 * <code:html>
 * <div id="myContracts" data-agreements="'services/administration/agreement'" data-agreements-request-params="agreementsParams"></div>
 * </code>
 * <code:js>
 * function ctrl ($scope) {
 *      $scope.agreementsParams = [
 *          { agreementName : 'contract1' },
 *          { agreementName : 'contract2' },
 *          { agreementName : 'contract3' },
 *      ];
 * }
 * </code>
 **/
angular.module('ua.agreements').directive('agreements', ['$http', function (http) {
    'use strict';
    return {
        'restrict': 'A',
        'transclude': true,
        'replace': false,
        'scope': true,
        'templateUrl' : 'components/ovh-utils-angular/agreements/agreements.html',
        'compile' : function () {
            return function (scope, elt, attrs) {
                var agreements = null;
                scope.loading = true;

                if (!attrs.agreements) {
                    throw '[ovh-utils-angular] ovhDirectives.agreements : No agrements found';
                }

                agreements = scope.$eval(attrs.agreements);

                scope.getAgreements = function () {
                    scope.requestParams = scope.$eval(attrs.agreementsRequestParams);
                    if (scope.requestParams) {

                        scope.loading = true;

                        // Oh paginated
                        if (angular.isArray(scope.requestParams)) {

                            scope.paginator = {
                                currentPage: 0
                            };

                            scope.$watch('paginator.currentPage', function (newPage) {
                                scope.loading = true;

                                if (newPage !== undefined) {
                                    http.get(agreements, {
                                        params : scope.requestParams[newPage],
                                        cache: true
                                    }).then(function (success) {
                                        scope.loading = false;

                                        if (angular.isObject(success)) {
                                            scope.agreements = success;
                                        } else {
                                            throw '[ovh-utils-angular] ovhDirectives.agreements : request result are not recognized ';
                                        }

                                    }, function (error) {
                                        scope.loading = false;
                                        scope.errors = [error];
                                        angular.element('#agreements-modal').modal('hide');
                                    });
                                }
                            });
                        // Juste one, no pagination
                        } else if (angular.isObject(scope.requestParams)) {

                            scope.paginator =  null;

                            http.get(agreements, {
                                params: scope.requestParams,
                                cache: true
                            }).then(function (success) {

                                scope.loading = false;

                                if (angular.isArray(success)) {
                                    scope.agreements = success;
                                } else if (angular.isObject(success)) {
                                    scope.agreements = success;
                                } else {
                                    throw '[ovh-utils-angular] ovhDirectives.agreements : request result are not recognized ';
                                }

                            }, function (error) {
                                scope.loading = false;
                                scope.errors = [error];
                                angular.element('#agreements-modal').modal('hide');
                            });
                        }
                    } else {
                        scope.agreements = [];
                    }
                };

                if (angular.isString(agreements)) {
                    scope.getAgreements();
                } else if (angular.isArray(agreements)) {
                    scope.agreements = agreements;
                } else if (angular.isObject(agreements)) {
                    scope.agreements = [agreements];
                } else if (agreements !== undefined) {
                    throw '[ovh-utils-angular] ovhDirectives.agreements : agreements must be an url or an array or an object';
                }

                scope.isFirstPage = function () {
                    if (scope.paginator) {
                        return scope.paginator.currentPage === 0;
                    }
                };

                scope.isLastPage = function () {
                    if (scope.paginator) {
                        return scope.paginator.currentPage + 1 >= scope.requestParams.length;
                    }
                };

                scope.incPage = function () {
                    if (scope.paginator && !scope.isLastPage()) {
                        scope.paginator.currentPage++;
                    }
                };

                scope.decPage = function () {
                    if (scope.paginator && !scope.isFirstPage()) {
                        scope.paginator.currentPage--;
                    }
                };

                scope.firstPage = function () {
                    if (scope.paginator) {
                        scope.paginator.currentPage = 0;
                    }
                };

                scope.numberOfPages = function () {
                    if (scope.paginator) {
                        if (angular.isArray) {
                            return scope.requestParams.length;
                        } else {
                            return 1;
                        }
                    } else {
                        return 1;
                    }
                };
            };// end return
        }// end compile
    };
}]);

angular.module('ua.alerter').directive('ovhAlert', function () {
    'use strict';
    return {
        restrict: 'A',
        scope: {
            ovhAlert: '@'
        },
        transclude: true,
        templateUrl: 'components/ovh-utils-angular/alerter/alerter.html',
        link: function ($scope, $elm, $attr) {

            function checkForGlobalOrId (id) {
                return (!$scope.ovhAlert && !id) || ($scope.ovhAlert && id === $scope.ovhAlert);
            }

            $scope.$on('ovhAlert.show', function(event, type, message, details, alertId) {
                if (checkForGlobalOrId(alertId)) {
                    $scope.ovhAlertMessage = message;
                    $scope.ovhAlertMessageDetails = details;
                    $scope.ovhAlertType = type;
                }
            });

            $scope.$on('ovhAlert.resetMessage', function(event, alertId) {
                if (checkForGlobalOrId(alertId)) {
                    $scope.resetMessages();
                }
            });

            $scope.resetMessages = function () {
                $scope.ovhAlertMessage = null;
                $scope.ovhAlertMessageDetails = null;
            };

            if ($attr.ovhAlertHideRemoveButton !== undefined) {
                $scope.ovhAlertHideRemoveButton = true;
            }
        }
    };
});

angular.module('ua.alerter').service('Alerter', ['$rootScope', function ($rootScope) {
    "use strict";

    var self = this,
        alertTypesHash = {
            'ERROR': 'alert-danger',
            'PARTIAL': 'alert-warning',
            'OK': 'alert-success',
            'WARNING': 'alert-warning',
            'INFO': 'alert-info',
            'BLOCKED': 'alert-danger',
            'blocked': 'alert-danger',
            'CANCELLED': 'alert-danger',
            'cancelled': 'alert-danger',
            'PAUSED': 'alert-danger',
            'paused': 'alert-danger',
            'error': 'alert-danger',
            'WAITING_ACK': 'alert-warning',
            'waitingAck': 'alert-warning',
            'DOING': 'alert-info',
            'doing': 'alert-info',
            'TODO': 'alert-success',
            'todo': 'alert-success',
            'DONE': 'alert-success',
            'done': 'alert-success',
            'true': 'alert-success',
            'init': 'alert-success',
            'INIT': 'alert-success',
            'false': 'alert-danger'
        };

    this.set = function (type, message, details, alertId) {
        $rootScope.$broadcast('ovhAlert.show', type, message, details, alertId);
    };

    this.success = function (message, alertId) {
        self.set(alertTypesHash.OK, message, null, alertId);
    };
    this.error = function (message, alertId) {
        self.set(alertTypesHash.ERROR, message, null, alertId);
    };

    this.alertFromSWSBatchResult = function (messages, data, alertId) {
        var messageToSend = "",
            messagesFiltered = [],
            i = 0,
            alertType = "",
            messageDetails = null;
        if(data && data.state) {
            messagesFiltered = $.grep(data.messages, function (e) {
                return e.type && e.type !== "INFO";
            });

            alertType = alertTypesHash[data.state];
            messageToSend = messages[data.state];
            if(data.state === 'OK') {
                if(messagesFiltered.length > 0) {
                    messageToSend += " (";
                    for (i; i < messagesFiltered.length; i++) {
                        messageToSend += messagesFiltered[i].id + " : " + messagesFiltered[i].message + (messagesFiltered.length === (i + 1) ? ')' : ', ');
                    }
                }
            }
            else {
                messageDetails = messagesFiltered;
            }
        }
        self.set(alertType, messageToSend, messageDetails, alertId);
    };

    this.alertFromSWS = function (message, data, alertId) {
        var messageToSend = message,
            i = 0,
            messagesFiltered = [],
            alertType = "";
        if (data) {
            if (data.message) {
                messageToSend += " (" + data.message + ")";
                alertType = alertTypesHash[data.type];
            }
            else if (data.messages) {
                if (data.messages.length > 0) {
                    alertType = alertTypesHash[data.state];
                    messagesFiltered = $.grep(data.messages, function (e) {
                        return e.type && e.type !== "INFO";
                    });
                    if(messagesFiltered.length > 0) {
                        messageToSend += " (";
                        for (i; i < messagesFiltered.length; i++) {
                            messageToSend += messagesFiltered[i].id + " : " + messagesFiltered[i].message + (messagesFiltered.length === (i + 1) ? ')' : ', ');
                        }
                    }
                }
            }
            else if (data.idTask && data.state) {
                alertType = alertTypesHash[data.state];
            }
            else if(alertTypesHash[data]) {
                alertType = alertTypesHash[data];
            }
        }
        self.set(alertType || 'alert-warning', messageToSend, null, alertId);
    };

    this.resetMessage = function(alertId){
        $rootScope.$broadcast('ovhAlert.resetMessage', alertId);
    };

}]);

angular.module('ua.clickRoute').controller('clickRouteCtrl', ['$element', '$attrs', function ($element, $attrs) {
    'use strict';
    if ($attrs.clickRoute) {
        $element.css('cursor', 'pointer');
        $element.click(function () {
            var route = $attrs.clickRoute;
            if (!$.isEmpty(route)) {
                window.location.hash = route;
            }
        });
        $element.removeAttr('click-route data-click-route x-click-route clickRoute');
    }
}]);

/**
 * @type directive
 * @name ovhDirectives:clickRoute
 * @description
 * Change route location on click.
 * # Usage
 * Add attribute `click-route` with desired route directly on an html element.
 * @example
 * Html view :
 *<code:html>
 *<button type="button" click-route="/configuration/adsl">Configuration ADSL page</button>
 *</code>
 */
angular.module('ua.clickRoute').directive('clickRoute', function () {
    'use strict';
    return {
        'restrict': 'A',
        'scope': false,
        'controller': 'clickRouteCtrl'
    };
});

angular.module('ua.contracts').directive('contracts', function () {
    "use strict";
    return {
        restrict : 'EA',
        replace  : true,
        require  : '^ngModel',
        templateUrl: 'components/ovh-utils-angular/contracts/contracts.html',
        scope : {
            contracts : '=',
            agree     : '=ngModel'
        },
        link : function ($scope, $elm, $attr) {

            $scope.fullText = $attr.fullText === "true" || $attr.fullText === undefined;

            var scrollToOptions = {
                'easing'  : 'swing',
                'duration' : '300',
                'offsetTop'  : '16'
            };

            $scope.disabled = true;


            $scope.$watch('contracts', function (nv) {
                if (nv !== undefined) {
                    init();
                }
            });

            var init = function () {

                $elm.find('.contracts-breadcrumb-navigate-previous').unbind('click');
                $elm.find('.contracts-breadcrumb-navigate-next').unbind('click');
                $elm.find('.contracts-list').unbind('scroll');
                $elm.find("#contracts-menu").undelegate('a', 'click');

                var topMenu = $elm.find("#contracts-menu");
                var lastId = 'contract-0';
                var menuItems = topMenu.find("a");
                var scrollItems;
                var initialOffSet;

                $scope.currentContract = $scope.contracts[0];
                $scope.disabled = true;


                //Fake Anchor
                topMenu.delegate('a', 'click', function(e){
                    var href = $(this).attr("data-fake-href");

                    $('.contracts-list').stop().scrollTo(href, scrollToOptions);

                    e.preventDefault();
                });

                $elm.find('.contracts-list').scroll(function (e) {

                    // enable check box
                    var elem = $(e.currentTarget);
                    if (elem[0].scrollHeight - elem.scrollTop() === elem.outerHeight()) {
                        $scope.$apply(function () {
                            $scope.disabled = false;
                        });
                    }

                    // Get container scroll position
                    var fromTop =  $elm.find('.contracts-list').height()/2 +  $elm.find('.contracts-list').offset().top;

                    if (scrollItems === undefined) {
                        scrollItems = menuItems.map(function() {
                            var item = $($(this).attr("data-fake-href"));
                            if (initialOffSet === undefined) {
                                initialOffSet = item.offset().top;
                            }
                            if (item.length) {
                                return item;
                            }
                        });
                    }

                    // Get id of current scroll item
                    var cur = scrollItems.map(function(){
                        if ($(this).offset().top <= fromTop) {
                            return this;
                        }
                    });

                    // Get the id of the current element
                    cur = cur[cur.length-1];
                    var id = cur && cur.length ? cur[0].id : 'contract-0';
                    if (lastId !== id) {
                        lastId = id;
                        $scope.$apply(function () {
                            $scope.currentContract = $scope.contracts[id.split('-')[1]];
                        });
                        menuItems.removeClass("active").parent().end().filter("[data-fake-href=#" + id + "]").addClass("active");
                    }
                });

                $elm.find('.contracts-breadcrumb-navigate-previous').click(function () {
                    if (lastId) {
                        $elm.find('.contracts-list').stop().scrollTo('#contract-' + (parseInt(lastId.split('-')[1], 10) - 1), scrollToOptions);
                    }
                });

                $elm.find('.contracts-breadcrumb-navigate-next').click(function () {
                    if (lastId) {
                        $elm.find('.contracts-list').stop().scrollTo('#contract-' + (parseInt(lastId.split('-')[1], 10) + 1), scrollToOptions);
                    }
                });

                menuItems.removeClass("active").parent().end().filter("[data-fake-href=#" + lastId + "]").addClass("active");
                window.setTimeout(function () {
                    $elm.find('.contracts-list').stop().scrollTo(0);
                } ,300);
            };

        }
    };
});

/**
 * @ngdoc directive
 * @name ovhDirectives.directive:dateTimePicker
 * @element ANY
 * @requires ?ngModel
 * @requires Tarruda's bootstrap-datetimepicker (JS and CSS)
 * @requires Moment
 *
 * @decription
 * Provide a date time picker, with 3 activable modes (date, datetime, time).
 *
 * @version 1.0.2
 *
 * @example
 * <code:html>
 *
 *  <div data-ng-controller="testCtrl">
 *
 *      <a href="#" class="btn small" id="test"
 *          data-dtp-placement="bottom"
 *          data-dtp-autoclose="true"
 *          data-ng-model="d.value"                     <!-- Caution: will be validated with the format -->
 *          data-dtp-format="DD/MM/YYYY HH:mm:ss"       <!-- Follow Moment rules -->
 *          data-dtp-type="date"                        <!-- ngModel var type (date by default). If set to "string", it follows the format -->
 *          data-dtp-model-timezone=""                  <!-- By default, the model is in UTC. Set this if you want to force a specific timezone (can be: "local", or a number) -->
 *          data-dtp-min-view-mode="months"
 *          data-dtp-pick-date="true"                   <!-- true by default -->
 *          data-dtp-pick-time="true"                   <!-- true by default -->
 *          data-dtp-pick-seconds="true"                <!-- true by default -->
 *          data-date-time-picker>
 *
 *          <span class="add-on">
 *              <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
 *          </span>
 *
 *          <input type="hidden"> <!-- or --> <input type="text">
 *
 *      </a>
 *
 *      <!-- Optional -->
 *      <button class="btn" data-toggle="datetimepicker">Toggle datetimepicker</button>
 *
 *  </div>
 *
 * </code>
 */
angular.module('ua.dateTimePicker').directive('dateTimePicker', ['$translate', 'ovhDirectives.constant.dateTimePicker.CONFIG_OPTIONS', 'ovhDirectives.constant.dateTimePicker.VIEW_MODE', '$parse', '$window', function($translate, config, viewMode, $parse, $window) {
    'use strict';

    /**
     * @doc method
     * @methodOf ovhDirectives.directive:dateTimePicker
     * @name ovhDirectives.directive:dateTimePicker#getLanguage
     * @returns {string} Language
     *
     * @description
     * Get the local language (auto get local).
     */
    function getLanguage() {
        var language;
        try  {
            language = $translate.resolveClientLocale().split('_')[0];
        } catch (e) {
            language = 'en';
        }

        return language;
    }

    /**
     * @doc method
     * @methodOf ovhDirectives.directive:dateTimePicker
     * @name ovhDirectives.directive:dateTimePicker#getPosition
     * @param {node} element The DOM element.
     * @returns {object} Position of the element
     *
     * @description
     * Return the position of an element.
     */
    function getPosition(element) {
        var el = element[0];

        if ($('#modal-container').has(el).length) {
            // Inside a modal
            return $.extend({}, angular.isFunction(el.getBoundingClientRect) ? el.getBoundingClientRect() : {
                width  : el.offsetWidth,
                height : el.offsetHeight
            }, {
                top  : element.offset().top - $(window).scrollTop(),
                left : element.offset().left - $(window).scrollLeft()
            });
        } else {
            return {
                width  : el.offsetWidth,
                height : el.offsetHeight,
                top    : element.offset().top,
                left   : element.offset().left
            };
        }
    }

    /**
     * @doc method
     * @methodOf ovhDirectives.directive:dateTimePicker
     * @name ovhDirectives.directive:dateTimePicker#getConvertedFormatForDP
     * @param  {string} format Moment format
     * @return {string} Converted format.
     *
     * @description
     * Convert the format for the datetimepicker.
     * e.g.: moment="DD/MM/YYYY HH:mm:ss" ; datetimepicker need: "dd/MM/yyyy hh:mm:ss"
     */
    function getConvertedFormatForDP(format) {
        // @todo remove special formatting tokens who are not supported by the DP plugin.
        return format.replace('DD', 'dd').replace('YYYY', 'yyyy').replace('YY', 'yy').replace('HH', 'hh');
    }

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function postLink(scope, element, attrs, controller) {

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#getOptions
             * @returns {object} The options
             *
             * @description
             * Sets the directive's options, using the datas of the element.
             */
            function getOptions() {
                var opt = {},
                    prefixedKey = '';

                angular.forEach(config, function(key) {
                    // Map options to prefixed attributes
                    prefixedKey = 'dtp' + (key.charAt(0).toUpperCase() + key.slice(1));
                    if(angular.isDefined(attrs[prefixedKey])) {
                        switch (key) {
                        case 'minViewMode':
                        case 'startView':
                            opt[key] = viewMode[attrs[prefixedKey]];
                            break;
                        case 'autoclose':
                        case 'pickDate':
                        case 'pickTime':
                        case 'pick12HourFormat':
                        case 'pickSeconds':
                            opt[key] = $parse(attrs[prefixedKey])(scope);
                            break;
                        case 'startDate':
                        case 'endDate':
                            // @todo temporary patch
                            opt[key] = new Date(attrs[prefixedKey]);
                            break;
                        case 'modelTimezone':
                            opt[key] = (attrs[prefixedKey] !== 'local' && attrs[prefixedKey] !== '' ? +attrs[prefixedKey] : attrs[prefixedKey]);
                            break;
                        default:
                            opt[key] = attrs[prefixedKey];
                        }
                    }
                    // Set default value
                    if (!opt.placement) {
                        opt.placement = 'bottom';
                    }
                });
                return opt;
            }

            var options = getOptions(),
                isAppleTouch = /(iP(a|o)d|iPhone)/g.test(navigator.userAgent) && !options.pickTime,   // @todo temporary patch (enable only for date)
                type = options.type || 'date',
                language = options.language || getLanguage(),
                readFormat = options.format || 'DD/MM/YYYY HH:mm:ss',
                format = isAppleTouch ? 'yyyy-mm-dd' : readFormat,
                formatDP = getConvertedFormatForDP(format),
                dtpData,
                dtpPopover;

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#init
             *
             * @description
             * Initialize the directive.
             */
            function init() {
                // Create datetimepicker
                element.datetimepicker(angular.extend(options, {
                    format: formatDP,
                    language: language
                }));

                dtpData = element.data('datetimepicker');
                dtpPopover = $(dtpData.widget[0]);

                // Because datetimepicker is buggy.
                if (options.minViewMode || options.startView) {
                    dtpData.startViewMode = dtpData.viewMode = options.minViewMode || options.startView;
                    dtpData.showMode();
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#destroy
             *
             * @description
             * Destroy the directive.
             */
            function destroy() {
                dtpData.destroy();
                angular.element($window).unbind('resize', windowResize);
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#windowResize
             *
             * @description
             * Adjust the position on window resize.
             */
            function windowResize() {
                if (dtpPopover.is(':visible')) {
                    var to = $window.setTimeout(function () {
                        managePlacement();
                        $window.clearTimeout(to);
                    }, 50);
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#toggleVisibility
             * @param {string} (optional) Force set of the dtp state.
             *
             * @description
             * Show/Hide (toggle) the datetimepicker dropdown.
             */
            function toggleVisibility(state) {
                if ((state && state === 'hide') || dtpPopover.is(':visible')) {
                    element.datetimepicker('hide');
                } else if ((state && state === 'show') || !!options.placement) {
                    element.datetimepicker('show');
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#managePlacement
             *
             * @description
             * Manage the placement, to simulate a popover.
             */
            function managePlacement() {
                var pickerWidth = dtpPopover.outerWidth(),
                    pickerHeight = dtpPopover.outerHeight(),
                    elemPos = getPosition(element),
                    windowWidth = $($window).width(),
                    placement = options.placement;

                dtpPopover.addClass(placement);
                dtpPopover.css({
                    "z-index": 10000
                });

                if (!dtpData.isInline) {
                    switch (placement) {
                    case 'bottom':
                        // If the datetimepicker overflow, pull it right.
                        if (windowWidth < elemPos.left + pickerWidth) {
                            dtpPopover.css({
                                top: elemPos.top + elemPos.height + 10,
                                left: 'auto',
                                right: windowWidth - elemPos.left - element[0].offsetWidth
                            });
                            dtpPopover.addClass('pull-right');
                        } else {
                            dtpPopover.css({
                                top: elemPos.top + elemPos.height + 10,
                                left: elemPos.left + elemPos.width / 2 - pickerWidth / 2,
                                right: 'auto'
                            });
                            dtpPopover.removeClass('pull-right');
                        }
                        break;
                    case 'top':
                        dtpPopover.css({
                            top : elemPos.top - pickerHeight,
                            left: elemPos.left + elemPos.width / 2 - pickerWidth / 2
                        });
                        break;
                    case 'left':
                        dtpPopover.css({
                            top : elemPos.top + elemPos.height / 2 - pickerHeight / 2,
                            left: elemPos.left - pickerWidth
                        });
                        break;
                    case 'right':
                        dtpPopover.css({
                            top : elemPos.top + elemPos.height / 2 - pickerHeight / 2,
                            left: elemPos.left + elemPos.width
                        });
                        break;
                    }
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#getDateString
             * @param  {string or date} date Date to format
             * @return {string} The date string
             *
             * @description
             * Convert date (date or string) into string.
             */
            function getDateString(date) {
                if (angular.isString(date)) {
                    return $window.moment(date, format).isValid() ? date : null;
                }
                return $window.moment(date).locale(language).format(format);
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#initController
             *
             * @description
             * Initialize Angular controller.
             */
            function initController() {
                // Handle date validity according to dateFormat
                if(controller) {

                    // modelValue -> $formatters -> viewValue
                    controller.$formatters.unshift(function(modelValue) {
                        return (options.type === 'date' ? new Date(modelValue) : getDateString(modelValue));
                    });

                    // viewValue -> $parsers -> modelValue
                    controller.$parsers.unshift(function(viewValue) {
                        if(!viewValue) {
                            controller.$setValidity('date', true);
                            return null;
                        } else if(angular.isDate(viewValue) && type === 'date') {
                            controller.$setValidity('date', true);
                            return viewValue;
                        } else if(angular.isDate(viewValue) && type === 'string') {
                            controller.$setValidity('date', true);
                            return getDateString(viewValue);
                        } else if(angular.isString(viewValue) && $window.moment(viewValue, format).isValid()) {
                            controller.$setValidity('date', true);
                            if(isAppleTouch) {
                                return new Date(window.moment(viewValue, format));
                            }
                            return type === 'string' ? getDateString(viewValue) : new Date($window.moment(viewValue, format));
                        } else {
                            controller.$setValidity('date', false);
                            return undefined;
                        }
                    });

                    // ngModel rendering
                    controller.$render = function ngModelRender() {
                        var date = null;
                        if(isAppleTouch) {
                            // @todo to modify
                            date = controller.$viewValue ? $.fn.datetimepicker.DPGlobal.formatDate(controller.$viewValue, $.fn.datetimepicker.DPGlobal.parseFormat(format), language) : '';
                            element.val(date);
                            return date;
                        }
                        if(controller.$viewValue && angular.isString(controller.$viewValue)) {
                            date = getDateString(controller.$viewValue);
                            if (!date) {
                                throw "viewValue format is incorrect!";
                            }
                            date = new Date($window.moment(date, format));
                        } else if(controller.$viewValue && angular.isDate(controller.$viewValue)) {
                            date = controller.$viewValue;
                        }

                        return dtpData.setLocalDate(date);
                    };
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#defineBehaviors
             *
             * @description
             * Define directive's behaviors.
             */
            function defineBehaviors() {
                // If we have a ngModelController then wire it up
                if(controller) {

                    element.on('show', function() {
                        managePlacement();
                    });

                    element.on('hide', function() {
                        // we need to check onClose if value is correct.
                        var dtpSelectedDate = dtpData.getDate();
                        if ( (options.startDate && dtpSelectedDate < options.startDate) || (options.endDate && dtpSelectedDate > options.endDate) ) {
                            dtpData.setLocalDate(controller.$viewValue);
                        }
                    });

                    // Element's childrens visibility toggle.
                    element.on('focus', 'input', function() {
                        toggleVisibility();
                    });
                    element.on('mousedown', '> :not(input):not(.add-on)', function(e) {
                        e.stopPropagation();
                        toggleVisibility();
                    });

                    // Support add-on.
                    var component = element.siblings('[data-toggle="datetimepicker"]');
                    if(component.length) {
                        component.on('mousedown', function(e) {
                            e.stopPropagation();
                            toggleVisibility();
                        });
                    }

                    // Update the view value on change date.
                    element.on('changeDate', function(e) {
                        if (!(options.minViewMode && dtpData.viewMode !== options.minViewMode)) {

                            scope.$apply(function () {
                                controller.$setViewValue(type === 'string' ? getDateString((options.modelTimezone ? e.localDate : e.date)) : (options.modelTimezone ? e.localDate : e.date));
                                if (options.autoclose && options.pickTime === false) {
                                    toggleVisibility('hide');
                                }
                            });
                        }
                    });

                    // [ISSUE]
                    // There are currently a bug with datetimepicker plugin. This is a temporary patch.
                    dtpPopover.find('th').on('click', function() {
                        var $table = $(this).parents('table');
                        setTimeout(function() {
                            // Previous
                            if ($table.find('tbody span:first-child').hasClass('disabled')) {
                                $table.find('th.prev').addClass('disabled');
                            } else {
                                $table.find('th.prev').removeClass('disabled');
                            }
                            // Next
                            if ($table.find('tbody span:last-child').hasClass('disabled')) {
                                $table.find('th.next').addClass('disabled');
                            } else {
                                $table.find('th.next').removeClass('disabled');
                            }
                        }, 99);
                    });

                    // Adjust the position on window resize.
                    angular.element($window).bind('resize', windowResize);

                    // Garbage collection.
                    scope.$on('$destroy', destroy);

                    // Update start-date when changed.
                    attrs.$observe('dtpStartDate', function(value) {
                        if (!!value) {
                            // @todo parse with Moment
                            options.startDate = new Date(value);
                            element.datetimepicker('setStartDate', options.startDate);
                        }
                    });

                    // Update end-date when changed.
                    attrs.$observe('dtpEndDate', function(value) {
                        if (!!value) {
                            // @todo parse with Moment
                            options.endDate = new Date(value);
                            element.datetimepicker('setEndDate', options.endDate);
                        }
                    });
                }
            }

            /*==========  Init  ==========*/

            if(isAppleTouch) {
                // Use native interface for touch devices
                element.prop('type', 'date').css('-webkit-appearance', 'textfield');
            } else {
                init();
                defineBehaviors();
                initController();
            }

        }
    };
}]);

/**
 * @type directive
 * @name ovhDirectives:elasticArea
 * @version 0.0.1
 * @description
 * autoresize text area
 * @example
 * # Usage
 * <code: html>
 * <textarea data-elastic-area></textarea>
 * </code>
 */
angular.module('ua.elasticArea').directive('elasticArea', function () {
    "use strict";

    function resize (t, offset) {
        t.height('auto');
        t.height(t[0].scrollHeight + offset);
    }

    return {
        replace: false,
        restrict: 'A',
        link : function ($scope, $elm) {
            if ($elm) {
                var t, offset;

                t = $elm;

                // add aria attr
                t.height('auto');
                t.attr('contenteditable', "true");
                t.attr('tabindex', "0");
                t.attr('role', 'textbox');
                t.attr('aria-multiline', "true");

                if (!window.opera) {
                    offset = t[0].offsetHeight - t[0].clientHeight;
                } else {
                    offset = t[0].offsetHeight + parseInt(window.getComputedStyle(t[0], null).getPropertyValue('border-top-width'), 10);
                }

                t.bind('input', function() {
                    resize(t, offset);
                });

                t.bind('keyup', function () {
                    resize(t, offset);
                });
            }
        }
    };

});

/**
 * @type directive
 * @name ovhDirectives:event
 * @description
 * event delegation by html attributes
 * # Usage
 * add attribute data-event-[eventName]="callback" into html element
 * @example
 * Html view :
 *<code:html>
 *  <div data-ng-controller="controller">
 *      <div data-event-click="callback" data-event-click-target="img">
 *          <img /><!-- target-->
 *          <img /><!-- target-->
 *          <img /><!-- target-->
 *          <img /><!-- target-->
 *          <img /><!-- target-->
 *      </div>
 *      <div data-event-dblclick="callback" data-event-dblclick-target="iframe.ici">
 *          <iframe></iframe>
 *          <iframe class="ici"></iframe><!-- target -->
 *      </div>
 *      <div data-event-mousedown="callbackWithData" data-event-mousedown-target="div > div" data-event-mousedown-data="'aaaaaa'">
 *          <div>
 *              <div></div> <!--target -->
 *          </div>
 *      </div>
 *      <div data-event-mouseup="callback"></div><!--target-->
 *      <!-- etc -->
 *  </div>
 *</code>
 * javascript:
 * <code:js>
 *  function controller () {
 *      $scope.callbackWithData = function (data, evt) {
 *          console.log(arguments);
 *      }
 *
 *      $scope.callback = function (evt) {
 *          console.log(arguments);
 *      }
 *
 *  }
 * </code>
 */
(function () {
    "use strict";
    var availableEvents = [
        'click',
        'dblclick',
        'mousedown',
        'mouseup',
        'mouseover',
        'mouseout',
        'mousemove',
        'mouseenter',
        'mouseleave',
        'keydown',
        'keyup',
        'keypress',
        'blur'
    ];
    var eventsNumber = availableEvents.length;

    function createDirective (eventName) {

        var directiveName = $.camelCase('event-' + eventName);
        var name = eventName;
        var module = angular.module('ua.event');

        module.directive(directiveName, ['$parse', function ($parse) {
            return {
                restrict : 'A',
                link : function ($scope, $elm, $attr) {

                    var callback = $parse($attr[directiveName]),
                        target = $attr[directiveName + 'Target'],
                        data = $parse($attr[directiveName + 'Data']);

                    if (angular.isFunction(callback($scope))){
                        if (target) {
                            if (typeof data !== 'function') {
                                $($elm).delegate(target, name, data, function (evt) {
                                    $scope.$apply(function() {
                                        callback($scope)(data, evt);
                                    });
                                });
                            } else {
                                $($elm).delegate(target, name, function (evt) {
                                    $scope.$apply(function() {
                                        callback($scope)(evt);
                                    });
                                });
                            }
                        } else {
                            if (typeof data !== 'function') {
                                $elm.bind(name, data, function (evt) {
                                    $scope.$apply(function() {
                                        callback($scope)(data, evt);
                                    });
                                });
                            } else {
                                $elm.bind(name, function (evt) {
                                    $scope.$apply(function() {
                                        callback($scope)(evt);
                                    });
                                });
                            }
                        }
                    }
                }
            };
        }]);
    }

    for (eventsNumber;eventsNumber--;) {
        createDirective(availableEvents[eventsNumber]);
    }
})();

angular.module('ua.extendedAccordion').directive('extendedAccordion', [
    '$timeout',
    '$rootScope',
    function ($timeout, $rootScope) {
        'use strict';
        return {
            restrict: 'A',
            link : function ($scope, $element) {
                var availableHeight,
                t,
                $searchForm   = $('#navigation-left-search-form'),
                $head         = $('#header-top-navigation'),
                ignoreAttr    = 'extended-accordion-ignore',
                toggleAttr    = 'extended-accordion-toggle',
                contentAttr   = 'extended-accordion-content',
                activeClass   = 'extended-accordion-toggle-in',
                closeClass    = 'extended-accordion-close';

                function attrSyntax(str) {
                    return '[' + str + '], [data-' + str + ']';
                }

                function close(elm, toggleElm, force) {
                    if(elm) {
                        elm.removeClass('extended-accordion-in')
                            .addClass(closeClass);
                    }

                    toggleElm.removeClass(activeClass);

                    if(force) {
                        toggleElm.siblings(attrSyntax(ignoreAttr)).hide();
                    }
                    $timeout(function () {
                        $rootScope.$broadcast("extendedAccordion.section.closed");
                    }, 350);
                }

                function open(elm, toggleElm) {
                    if(elm) {
                        elm.addClass('extended-accordion-in')
                            .removeClass(closeClass);
                    }

                    toggleElm.addClass(activeClass);

                    toggleElm.siblings(attrSyntax(ignoreAttr)).show();
                    $timeout(function () {
                        $rootScope.$broadcast("extendedAccordion.section.opened");
                    }, 350);
                }

                function adaptHeight() {
                    var opened, h;

                    opened = $element.find(attrSyntax(contentAttr).concat(':not(.extended-accordion-close)'));

                    h =  availableHeight;

                    opened.each(function (i, item) {
                        h -= ($(item).outerHeight() - $(item).height());
                    });

                    h =  h / (opened.length || 1);

                    opened.height(h);
                }

                function toggle(elm, toggleElm) {
                    if (elm.hasClass(closeClass) || elm.size() === 0 ) {
                        if ($element.attr('data-extended-accordion') !== "multi") {
                            $element.find(attrSyntax(toggleAttr)).each(function() {
                                close($(this).siblings(attrSyntax(contentAttr)), $(this), true);
                            });
                        }
                        open(elm, toggleElm);
                    } else{
                        close(elm, toggleElm, true);
                    }
                    getAvailableHeight();
                    adaptHeight();
                }

                function getAvailableHeight() {
                    var searchForm = $searchForm.height() || 0,
                    head = $head.height() || 0;

                    //Initiale element height
                    availableHeight  = $(window).height() - searchForm - head - 10;

                    //Remove togglers outerHeight
                    $element.find(attrSyntax(toggleAttr)).each(function() {
                        availableHeight -= $(this).outerHeight();
                    });

                    //Remove all tagged parasite outerHeight
                    $element.find(attrSyntax(ignoreAttr).concat(':visible')).each(function() {
                        availableHeight -= $(this).outerHeight();
                    });

                    //return compononent height
                    return availableHeight;
                }

                function initSize() {
                    var searchForm = $searchForm.height() || 0,
                    head = $head.height() || 0,
                    allElement = $element.find('[data-extended-accordion-toggle]');


                    $element.height($(window).height() - searchForm - head - 10);

                    $element.find(attrSyntax(toggleAttr)).each(function () {
                        var elem = $(this),
                            target = $(this).siblings(attrSyntax(contentAttr));

                        if (!elem.hasClass(activeClass)) {
                            close(target, elem);
                        } else {
                            open(target, elem);
                        }
                    });

                    if($element.find('.' + activeClass).size() === 0) {
                        // find active element
                        allElement.each(function() {
                            var elem = $(this),
                            target = $(this).siblings(attrSyntax(contentAttr));

                            if(target.find(".active").size() > 0) {
                                open(target, elem);
                            }
                        });
                    }

                    if($element.find('.' + activeClass).size() === 0) {
                        // No element selected, so open the first
                        allElement.first().each(function() {
                            var elem = $(this),
                            target = $(this).siblings(attrSyntax(contentAttr));

                            open(target, elem);
                        });
                    }

                    getAvailableHeight();
                    adaptHeight();
                }

                $timeout(function() {

                    $element.find(attrSyntax(toggleAttr)).each(function() {
                        $(this).on('click', function() {
                            var elmToToggle = $element.find($(this).siblings(attrSyntax(contentAttr)));
                            toggle(elmToToggle, $(this));
                        });
                    });

                    angular.element(window).bind('resize', initSize);

                    t = window.setTimeout(function () {
                        initSize();
                        window.clearTimeout(t);
                    }, 500);

                    $scope.$on('extendedAccordion.open.section', function (ev, selector) {
                        angular.noop(ev);
                        var elm = angular.element('*[data-type*="'+selector+'"]'),
                            elmToToggle = elm.siblings(attrSyntax(contentAttr));
                        open(elmToToggle, elm);
                        getAvailableHeight();
                        adaptHeight();
                    });

                    $scope.$on('extendedAccordion.close.section', function (ev, selector) {
                        angular.noop(ev);
                        var elm = angular.element('*[data-type*="'+selector+'"]'),
                            elmToToggle = elm.siblings(attrSyntax(contentAttr));
                        close(elmToToggle, elm, true);
                        getAvailableHeight();
                        adaptHeight();
                    });

                    $scope.$on('$destroy', function () {
                        angular.element(window).unbind('resize', initSize);
                    });

                });
            }
        };
    }
]);

/**
 * @type directive
 * @name ovhDirectives:flextable
 * @description
 * TODO
 */
angular.module('ua.flexTable').controller('flexTableCtrl',
['$scope', '$element', '$attrs',
function ($scope, $element, $attrs) {
    "use strict";
    var sortable    = $attrs.sortable,
    selectable  = $attrs.selectable,
    multiselect = $attrs.multiselect,
    included    = $attrs.included,
    scope       = $scope;

    if (included && included === 'true') {
        scope = $scope.$parent;
    }

    scope.responsive = !!$attrs.responsive;

    if (sortable && sortable === 'true') {
        scope.table = {
            order : {},
            sortIcon : function (sortOn) {
                return ' icon-chevron-' + this.order[sortOn];
            },
            sort : function (tableValue, sortOn) {
                var currentSort = this.order[sortOn], sortDirection = 'up', pathArray = sortOn.split('.');

                if (currentSort === 'up') {
                    sortDirection = 'down';
                }
                this.order = {};
                this.order[sortOn] = sortDirection;

                function getValue(object, pathArray) {
                    var currentObject = object,
                    i;
                    for (i = 0; i < pathArray.length; i++) {
                        currentObject = currentObject[pathArray[i]];
                    }

                    return currentObject;
                }

                function sort(a, b) {
                    var valueA = getValue(a, pathArray), valueB = getValue(b, pathArray);

                    if (valueA === valueB) {
                        return 0;
                    }

                    if (valueA === null || typeof valueA === 'undefined') {
                        valueA = '';
                    }

                    if (valueB === null || typeof valueB === 'undefined') {
                        valueB = '';
                    }

                    if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return valueA < valueB ? -1 : 1;
                    }

                    return String(valueA).trim().localeCompare(String(valueB).trim());
                }

                function reverse(a, b) {
                    return sort(a, b) * -1;
                }

                if (sortDirection === 'down') {
                    tableValue.sort(reverse);
                } else {
                    tableValue.sort(sort);
                }

            }
        };
    }

    if (selectable && selectable === 'true') {

        scope.tableId = scope.$id;
        scope.selectionMap = {};

        scope.isMultiSelect = function () {
            return multiselect === 'true';
        };

        scope.addSelection = function (id, obj) {
            if (!scope.isMultiSelect())
            {
                scope.selectionMap = {};
            }

            if (!scope.selectionMap[id])
            {
                scope.selectionMap[id] = obj;
            }

            if (!scope.$$phase) {
                scope.$apply();
            }
        };

        scope.removeSelection = function (id) {
            if (scope.selectionMap[id])
            {
                delete scope.selectionMap[id];
            }
            if (!scope.$$phase) {
                scope.$apply();
            }
        };

        scope.setAllChecked = function (bool) {

            $.each($element.find('div.table-div-striped > div > div:first-child > input'), function (index, input) {
                if ((bool && !$(input).is(':checked')) || (!bool && $(input).is(':checked'))) {
                    $(input).click();
                }
            });
        };

        scope.hasSelection = function () {
            return $.count(scope.selectionMap) > 0;
        };

        scope.getSelection = function () {
            return $.values(scope.selectionMap);
        };

        scope.getFirstSelection = function () {
            return scope.getSelection()[0];
        };
    }
}]);

angular.module('ua.flexTable').directive('flextable', function () {
        'use strict';
        return {
            'restrict': 'AE',
            'transclude': true,
            'scope': false,
            'link': function (scope, iElement, iAttrs) {
                var sortableHeaders = [],
                    list = false,
                    elem = null,
                    checkbox = null;

                // sortable
                if (scope.table) {

                    $.each(iElement.find('div.fix-header > div > div'), function (index1, header) {

                        var sortOn = $(header).attr("sort-on") || $(header).attr("data-sort-on") || $(header).attr("x-sort-on"),
                            s1 = null;

                        if (sortOn) {
                            s1 = sortOn.split(":");

                            if (s1.length === 2) {
                                sortableHeaders.push(header);

                                $(header).append("<i class=\"\"></i>");
                                $(header).click(function () {

                                    if (!list) {
                                        list = scope;

                                        $.each(s1[0].split("."), function (index2, key) {
                                            list = list[key];
                                        });
                                    }

                                    scope.table.sort(list, s1[1]);

                                    // clear icons
                                    $.each(sortableHeaders, function (index3, sortableHeader) {
                                        $(sortableHeader).find("i").removeClass();
                                    });

                                    // update clicked header icon
                                    $(header).find("i").addClass(scope.table.sortIcon(s1[1]));

                                    if (!scope.$$phase) {
                                        scope.$apply();
                                    }
                                });
                            }
                        }
                    });
                }

                // scrollable
                if (iAttrs.scrollable && iAttrs.scrollable === 'true') {
                    iElement.find('div.table-div-striped').addClass('scrollable');
                }

                // selectable
                if (scope.selectionMap) {
                    //line clickable
                    iElement.click(function (evt) {
                        var target = $(evt.target);
                        if (!target.is('input')) {
                            evt.stopPropagation();

                            if (!target.is('div.row-fluid.table-row')) {
                                target = target.parents('div.row-fluid.table-row');
                            }

                            if (target.parents('div.fix-header').length === 0) {

                                target = target.find('input');

                                if (target && target[0]) {
                                    $(target[0]).click();
                                }
                            }
                        }
                    });

                    if (scope.isMultiSelect()) {
                        // header global selection
                        elem = iElement.find('div.fix-header > div > div:first-child');
                        checkbox = null;

                        if (elem) {
                            checkbox = $(document.createElement("input")).attr({
                                'value': '',
                                'type': 'checkbox',
                                'checked': false
                            });

                            checkbox.change(function () {
                                scope.setAllChecked(checkbox.is(':checked'));
                            });

                            elem.html(checkbox);
                        }
                    }
                }

                if (scope.responsive) {
                    iElement.find('div.fix-header').addClass('hidden-phone');
                }
            },
            'controller': 'flexTableCtrl',
            'template': '<div class="table-div" ng-transclude></div>',
            'replace': true
        };
    })
    .directive('headers', function () {
        'use strict';
        return {
            'restrict': 'AE',
            'require' : 'flextable',
            'transclude': true,
            'scope': false,
            'template': '<div class="fix-header"><div class="row-fluid table-row" ng-transclude></div></div>',
            'replace': true
        };
    })
    .directive('header', function () {
        'use strict';
        return {
            'restrict': 'E',
            'transclude': true,
            'scope': {
                'size' : '@'
            },
            'template': '<div class="span{{size}}" ng-transclude></div>',
            'replace': true
        };
    })
    .directive('header', function () {
        'use strict';
        return {
            'restrict': 'A',
            'scope': false,
            link: function (scope, iElement, iAttrs) {
                if (iAttrs && iAttrs.size) {
                    iElement.addClass('span' + iAttrs.size);
                }
            }
        };
    })
    .directive('rows', function () {
        'use strict';
        return {
            'restrict': 'E',
            'transclude': true,
            'scope': false,
            'template': '<div class="table-div-striped" ng-transclude></div>',
            'replace': true
        };
    })
    .directive('rows', function () {
        'use strict';
        return {
            'restrict': 'A',
            'scope': false,
            link: function (scope, iElement) {
                var parent = iElement.parent();
                if (parent && parent.hasClass('table-div')) {
                    iElement.addClass('table-div-striped');
                }
            }
        };
    })
    .directive('row', function () {
        "use strict";
        return {
            'restrict': 'AE',
            'transclude': true,
            'scope': false,
            'link': function (scope, iElement) {

                // selectable
                if (scope.selectionMap) {
                    var ngRepeat = iElement.attr('ng-repeat') || iElement.attr('data-ng-repeat'),
                        item = ngRepeat.split(' ')[0],
                        cell = iElement.find('> div:first-child'), cellElem;

                    if (cell) {
                        if ($.isFunction(scope.flextableInputRowGenerator)) {
                            cellElem = scope.flextableInputRowGenerator(scope[item]);
                        }

                        if ($.isEmpty(cellElem)) {
                            cellElem = $(document.createElement("input")).attr({
                                'value': scope.$id,
                                'type': scope.isMultiSelect() ? 'checkbox' : 'radio',
                                'name': scope.isMultiSelect() ? ('cb_'  + scope.tableId + '_' + scope.$id) : ('radio_' + scope.tableId),
                                'checked': false
                            });

                            cellElem.change(function () {
                                var parentRow = $(this).parents('div.row-fluid.table-row'),
                                    parentRows = null, i = 0;

                                if (cellElem.is(':checked')) {
                                    scope.addSelection(cellElem.val(), scope[item]);
                                    if (!scope.isMultiSelect()) {
                                        parentRows = $(this).parents('div.table-div-striped').find('div.row-fluid.table-row');
                                        if (parentRows && parentRows.length) {
                                            for (i = 0 ; i < parentRows.length ; i++) {
                                                $(parentRows[i]).removeClass('table-row-selected');
                                            }
                                        }
                                    }
                                    parentRow.addClass('table-row-selected');
                                } else {
                                    scope.removeSelection(cellElem.val());
                                    parentRow.removeClass('table-row-selected');
                                }
                            });
                        }
                        cell.html(cellElem);
                    }
                }
            },
            'template': '<div class="row-fluid table-row" ng-transclude></div>',
            'replace': true
        };
    })
    .directive('cell', function () {
        'use strict';
        return {
            'restrict': 'AE',
            'transclude': true,
            'scope': {
                'size'       : '@',
                'datatitle' : '@'
            },
            'template': '<div class="span{{size}}" ng-transclude></div>',
            'replace': true
        };
    });

/**
 * @type directive
 * @name ovhDirectives:grid
 * @version 1.0.0
 * @description
 * Provide a very lightweight scrollable table
 * @param {string} data the variable name
 * @param {string} selectable 'multi' or 'single'
 * @param {boolean} sortable
 * @param {string} identifierField the field for select a row
 * @param {Object} css a style description
 *@example
 * <code:html>
 * <div data-ng-controller="MyCtrl">
 *  <!-- some stuff -->
 *   <!-- ... -->
 *  <div grid="gridOptions" />
 * </div>
 * </code>
 * <code:js>
 * var MyCtrl = function (scope) {
 *
 *     scope.data = [];
 *
 *     scope.itemSelections : [];
 *
 *     scope.$watch('itemSelections', function (newValue) {
 *          //do stuff on change selection
 *     });
 *
 *     scope.gridOptions : {
 *          data: 'data',
 *          sortable: true,
 *          selectable: 'multi',
 *          identifierField: 'id',
 *          selectedItem: 'itemSelections',
 *          columns: [{
 *              field: 'date',
 *              displayName: 'Date'
 *          }, {
 *              field: 'sender'
 *              displayName: 'Emetteur'
 *          }]
 *     };
 *
 *     $http.get('url', function (result) {
 *          scope.data = result.results;
 *     });
 * };
 * MyCtrl.$inject = [$scope];
*  </code>
 **/
angular.module('ua.grid').directive('grid', function () {
    'use strict';
    // directive description
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: true,

        templateUrl: 'components/ovh-utils-angular/grid/grid.html',
        link: function (scope, elt, attrs) {
            var options = scope.options = scope.$parent.$eval(attrs.grid),
                i = -1, nbColumns = -1,
                register = function (idx) {
                    scope.$watch(scope.columns[i].displayName, function (newValue) {
                        if (newValue !== undefined) {
                            scope.columns[idx].displayName = newValue;
                        }
                    });
                };

            if (!options) {
                options = scope.options = {
                    rows : {},
                    columns : []
                };
            }
            scope.rows = scope.$parent.$eval(options.data);

            scope.columns = options.columns;
            i = nbColumns = scope.columns.length;

            scope.selectedItem = {};
            scope.allChecked = {
                allChecked: false
            };
            scope.predicateSortOrder = '';
            scope.orderReverseSort = false;
            scope.search = scope.$parent.$eval(options.search);

            //Just define some default class and style
            if (!scope.options.css) {
                scope.options.css = {};
            }
            scope.options.css = angular.extend({
                header : {
                    'class': 'row-fluid'
                },
                row: {
                    'class': 'row-fluid'
                },
                body: {
                    style: {
                        'overflow': 'auto',
                        'max-height': '168px'
                    }
                },
                container: {
                    style: {
                        'padding': '2px 0px 0px 2px'
                    }
                }
            }, scope.options.css);

            for (i ; i-- ;) {
                if (!scope.columns[i].css) {
                    scope.columns[i].css = {};
                }
                scope.columns[i].css = angular.extend({
                    'class': 'span' + (12  / (nbColumns % 12))
                }, scope.columns[i].css);

                register(i);
            }

            scope.$watch(options.data, function (newValue) {
                scope.rows = newValue;
            });

            // If search watch after change
            if (options.search !== null && options.search !== undefined && options.search !== '') {
                scope.$watch(options.search, function (newValue) {
                    scope.search = newValue;
                }, true);
            }

            // when change selectedItem change parent item
            if (scope.options.selectable !== null &&
                    scope.options.selectable !== undefined &&
                    (scope.options.selectable === 'multi' ||
                     scope.options.selectable === 'single')) {

                scope.$watch('selectedItem', function (newValue) {
                    if (scope.options.selectable === 'multi') {
                        scope.$emit('gridSelectionChange', $.grep(scope.rows, function (item) {
                                if (newValue.hasOwnProperty(item[scope.options.identifierField])) {
                                    return newValue[item[scope.options.identifierField]];
                                } else {
                                    return false;
                                }
                            })
                        );
                    } else {
                        scope.$emit('gridSelectionChange', $.grep(scope.rows, function (item) {
                                return item[scope.options.identifierField] === newValue.items;
                            })
                        );
                    }
                }, true);// end watch

                //to select or unselecte al element
                scope.toggleSelectAll = function () {
                    var tmpSelection = {};
                    if (scope.allChecked.allChecked) {
                        angular.forEach(scope.rows, function (item) {
                            tmpSelection[item[scope.options.identifierField]] = true;
                        });
                    }
                    scope.selectedItem = tmpSelection;
                };// end toggleSelecteAll
            } else if (scope.options.selectable !== null && scope.options.selectable !== undefined && (scope.options.selectable !== 'multi' || scope.options.selectable !== 'single')) {
                throw "[ovhdirectives.grid] - Unknown value for selectable options, it must be 'single' or 'multi'";
            }// end if
            //to sort
            scope.sort = function (field) {
                scope.orderReverseSort = !scope.orderReverseSort;
                scope.predicateSortOrder = field;
            };//end sort
        }// endlink  function
    };//end return directive
});//end directive

/**
 * @type filter
 * @name ovhFilters:highlighter
 * @description
 * highlight a search word into paragraphe
 * # Usage
 *<code:html>
 *{{text |highlighter:searchText}}
 *</code>
 * # Parameters
 * - {string} `searchText` - Search text
 * # Return
 * {string} - text with search text wrapped into span with classe 'ui-match'.
 * @example
 * Html view :
 *<code:html>
 *
 *<style>
 * my-class {
 *      background-color: yellow;
 * }
 *</style>
 *
 *<p>{{'0328044856'|highlighter:'2804':'my-classe'}}</p>
 *</code>
 * Result :
 *<result>
 *<p>03<span class="ui-match my-class" style="background-color:yellow;">2804</span>4856</p>
 *</result>
 */
angular.module('ua.highlight').filter('highlighter', function () {
    "use strict";

    return function (text, search) {
        var tempArray = [],
            i = 0, v = '',
            searchRegex = null, customClass = '';

        if ((search || angular.isNumber(search)) && (text || angular.isNumber(text))) {

            for (i ; i < search.length ; i++) {

                v = search[i];

                if (['\\', '(', ')', '[', ']', '^', '$', '?', '.', '+', '*'].indexOf(v) > -1) {
                    tempArray.push(['\\', v].join(''));
                } else {
                    tempArray.push(v);
                }
            }
            searchRegex = tempArray.join("\\s?");

            return text.replace(new RegExp("(" + searchRegex + ")", "gi"), "<span class='ui-match" + (customClass ? (' ' + customClass) : '') + "'>$1</span>");

        } else {
            return text;
        }
    };

});

/**
 * @type service
 * @name ovhServices:HttpInterceptor
 * @description
 * Handle HTTP errors.
 * HTTP 401 error status automatically redirect to login page (`login.html`).
 */
angular.module('ua.httpInterceptor').factory('HttpInterceptor',
['$q',

function ($q) {
    'use strict';

    return {
        'responseError' : function (err) {

            if (err.status === 500) {

                if (err.data === null || err.data === undefined || err.data === "") {
                    err.data = {};
                }

                err.data.toAlert = function (scope) {
                    scope.errors = [{
                        'message' : scope.tr('error_request'),
                        'sevices' : [err.config.method + ' ' + err.config.url]
                    }];
                };
            }
            return $q.reject(err);
        }
    };
}

]);

angular.module("ua.humanReadableSize").filter("humanReadableSize", [
    "$translate",
    function ($translate) {
        "use strict";

        return function (size, options) {

            if (isNaN(size)) {
                return "";
            }

            var opts = options || {};
            opts.suffixes = {
                B: $translate.instant("unit_size_B"),
                KB: $translate.instant("unit_size_KB"),
                MB: $translate.instant("unit_size_MB"),
                GB: $translate.instant("unit_size_GB"),
                TB: $translate.instant("unit_size_TB"),
                PB: $translate.instant("unit_size_PB"),
                EB: $translate.instant("unit_size_EB"),
                ZB: $translate.instant("unit_size_ZB"),
                YB: $translate.instant("unit_size_YB")
            };

            return filesize(size, opts);
        };
    }
]);

/**
 * @type directive
 * @name ovhDirectives:i18n
 * @see [url=http://docs.angularjs.org/guide/ie]Internet Explorer Compatibility[/url]
 * @version 1.2.0
 * @description
 * Provide translation with bbcode support, pluralization and co.
 * # Require
 * [url=#/module=ovhServices&service=translator]`translator`[/url] service on controller view.
 * # Usage
 * Has element name (not recommended for IE compatibity):
 *<code:html>
 *<i18n key="propertie_file_key" count="pluralize_value" vars="value1 | value2 | value3" bbcode="true"/>
 *</code>
 * Has attribute (highly recommended syntax):
 *<code:html>
 *<div data-i18n="propertie_file_key"></div>
 *<div data-i18n="propertie_file_key" data-bbcode="true"></div>
 *<div data-i18n data-key="propertie_file_key" data-count="pluralize_value" data-vars="value1 | value2 | value3" data-bbcode="true"></div>
 *</code>
 * - [b]i18n[/b]: {string} (as attribute only) properties file translation key (key attribute not needed. If both are used, key ovverride i18n property)
 * - [b]key[/b]: {string} properties file translation key
 * - [b]count[/b]: {integer} pluralize translation (optional)
 * - [b]vars[/b]: {pipe-separated string} variables (optional)
 * - [b]bbcode[/b]: {boolean} use bbcode (optional)
 * # Supported bbcode
 *<html>
 * <b>[b]</b>a text<b>[/b]</b> : bold<br/>
 * <b>[i]</b>a text<b>[/i]</b> : italic<br/>
 * <b>[u]</b>a text<b>[/u]</b> : underline<br/>
 * <b>[class=css_class_name]</b>a text<b>[/class]</b> : css class<br/>
 * <b>[color=a_color]</b>a text<b>[/color]</b> : text color<br/>
 * <b>[size=a_size_with_unit]</b>a text<b>[/size]</b> : font size<br/>
 * <b>[url]</b>an url<b>[/url]</b> : add clickable url<br/>
 * <b>[url=an_url]</b>a text<b>[/url]</b> : add clickable url with a specified text<br/>
 * <b>[email]</b>a mail address<b>[/email]</b> : add clickable email (mailto:)<br/>
 * <b>[email=a_mail_address]</b>a text<b>[/email]</b> : add clickable email (mailto:) with a specified text<br/>
 * <b>[br]</b> : new line
 *</html>
 * @example
 * Properties file :
 *<code>
 *text1 = Line 1.[br]Line 2.
 *text2 = Simple [b][i]example[/i][/b] text.
 *text3 = My value [b]{0}[/b]. Mon text en dur : [i]{1}[/i]
 *text_pl_3 = Ma pluzalization
 *</code>
 * Html view :
 *<code:html>
 *<div data-ng-controller="MyController">
 *   <div data-i18n="text1"></div>
 *   <div data-i18n="text1" data-bbcode="true"></div>
 *   <div data-i18n="text3" vars="{{value}} | mon text en dur" data-bbcode="true"></div>
 *   <div data-i18n="text_pl_3" data-count="{{1+2}}"></div>
 *   <p><i18n data-key="text1"/></p>
 *   <p><i18n data-key="text1" data-bbcode="true"/></p>
 *   <p><i18n data-key="text2"/></p>
 *   <p><i18n data-key="text2" data-bbcode="true"/></p>
 *   <p><i18n data-key="text3"/></p>
 *   <p><i18n data-key="text3" data-vars="{{value}} | mon text en dur" data-bbcode="true"/></p>
 *   <p><i18n data-key="text_pl_3" data-count="{{1+2}}"/></p>
 *   <div data-i18n data-key="text1"></div>
 *   <div data-i18n data-key="text1" data-bbcode="true"></div>
 *   <div data-i18n data-key="text3" vars="{{value}} | mon text en dur" data-bbcode="true"></div>
 *   <div data-i18n data-key="text_pl_3" data-count="{{1+2}}"></div>
 *</div>
 *</code>
 * Javascript controller :
 *<code:js>
 *var MyController = function (scope, translator) {
 *   translator.load(['myModule']);
 *   scope.value = "a";
 *};
 *MyController.$inject = ['$scope', 'translator'];
 *</code>
 * Result :
 *<result>
 *<div data-i18n="text1">Line 1.[br]Line 2.</div>
 *<div data-i18n="text1" data-bbcode="true">Line 1.<br/>Line 2.</div>
 *<div data-i18n="text3" vars="a | mon text en dur" bbcode="true">My value <b>a</b>. Mon text en dur : <i>mon text en dur</i></div>
 *<div data-i18n="text_pl_3" data-count="3">Ma pluzalization</div>
 *<p><span data-key="text1">Line 1.[br]Line 2.</span></p>
 *<p><span data-key="text1" data-bbcode="true">Line 1.<br/>Line 2.</span></p>
 *<p><span data-key="text2">Simple [b][i]example[/i][/b] text.</span></p>
 *<p><span data-key="text2" data-bbcode="true">Simple <b><i>example</i></b> text.</span></p>
 *<p><span data-key="text3">My value [b]{0}[/b]. Mon text en dur : [i]{1}[/i]</span></p>
 *<p><span data-key="text3" vars="a | mon text en dur" bbcode="true">My value <b>a</b>. Mon text en dur : <i>mon text en dur</i></span></p>
 *<p><span data-key="text_pl_3" data-count="3">Ma pluzalization</span></p>
 *<div data-i18n data-key="text1">Line 1.[br]Line 2.</div>
 *<div data-i18n data-key="text1" data-bbcode="true">Line 1.<br/>Line 2.</div>
 *<div data-i18n data-key="text3" vars="a | mon text en dur" bbcode="true">My value <b>a</b>. Mon text en dur : <i>mon text en dur</i></div>
 *<div data-i18n data-key="text_pl_3" data-count="3">Ma pluzalization</div>
 *</result>
 */
angular.module('ua.i18n').directive('i18n', ['translator', function (translator) {
        'use strict';
        return {
            'restrict': 'E',
            'replace': true,
            'transclude': true,
            'template': '<span data-ng-transclude></span>',
            'scope': {
                'key': '@',
                'vars': '@',
                'bbcode': '@',
                'count': '@'
            },
            'compile': function () {
                return {
                    pre: function (scope, elts) {
                        angular.element(elts).css({'display': 'none'});
                    },
                    post: function (scope, elts) {
                        var compile = function (newValue, oldValue, scope) {
                            if (newValue !== null && newValue !== undefined) {

                                var key = scope.key || '',
                                        count = (scope.count && !isNaN(scope.count)) ? parseInt(scope.count, 10) : null,
                                        vars = scope.vars ? scope.vars.split('|') : (scope.vars === undefined ? null : []),
                                        bbcode = scope.bbcode ? scope.bbcode : false,
                                        html;

                                if (count !== null) {
                                    html = translator.trpl(key, count, vars, bbcode);
                                } else {
                                    html = translator.tr(key, vars, bbcode);
                                }
                                angular.element(elts).html(html);
                                angular.element(elts).css({'display': ''});
                            }
                        };

                        scope.$watch('vars', compile);
                        scope.$watch('count', compile);
                        scope.$watch('key', compile);

                        if (angular.isObject(scope.$parent.i18n)) {
                            scope.$watch('$parent.i18n', compile, true);
                        } else if (angular.isObject(angular.isObject(scope.$root.i18n))) {
                            scope.$watch('$root.i18n', compile, true);
                        }
                    }
                };
            }
        };
    }])
    .directive('i18n', ['translator', function (translator) {
        'use strict';
        return {
            'restrict': 'A',
            'scope': {
                'i18n': '@',
                'key': '@',
                'vars': '@',
                'bbcode': '@',
                'count': '@'
            },
            'compile': function () {
                return {
                    pre: function (scope, elts) {
                        angular.element(elts).css('display', 'none');
                    },
                    post: function (scope, elts) {
                        var compile = function (newValue, oldValue, scope) {
                            if (newValue !== null && newValue !== undefined) {
                                var key = scope.key || scope.i18n || '',
                                        count = scope.count && !isNaN(scope.count) ? parseInt(scope.count, 10) : null,
                                        vars = scope.vars ? scope.vars.split('|') : (scope.vars === undefined ? null : []),
                                        bbcode = scope.bbcode ? scope.bbcode : false,
                                        html;

                                if (count !== null) {
                                    html = translator.trpl(key, count, vars, bbcode);
                                } else {
                                    html = translator.tr(key, vars, bbcode);
                                }

                                angular.element(elts).html(html);
                                angular.element(elts).css('display', '');
                            }
                        };

                        scope.$watch('vars', compile);
                        scope.$watch('count', compile);
                        scope.$watch('i18n', compile);
                        scope.$watch('key', compile);

                        if (angular.isObject(scope.$parent.i18n)) {
                            scope.$watch('$parent.i18n', compile, true);
                        } else if (angular.isObject(angular.isObject(scope.$root.i18n))) {
                            scope.$watch('$root.i18n', compile, true);
                        }

                    }
                };
            }
        };
    }]).directive('i18nStatic', function () {
        'use strict';
        return {
            'restrict'  : 'A',
            'controller': ['$scope', function ($scope){

                this.removeWatcher = function () {
                    var self = this;

                    if (self.unregistrer !== undefined) {
                        self.unregistrer();

                        delete self.unregistrer;
                    }
                };

                this.setWatcher = function (key, callback) {
                    var self = this;

                    self.unregistrer = $scope.$watch(key, function (newValue) {

                        var func = callback,
                            me = self;
                        if (newValue !== undefined) {
                            me.removeWatcher();
                            if (!!func && angular.isFunction(func)) {
                                func(newValue);
                            }
                        }
                    });
                };

            }],
            'link'      : function ($scope, $elm, $attrs, ctrl) {

                var key = ['i18n', $attrs.i18nStatic].join('.'),
                    translatorValue = $scope[key];

                if (translatorValue !== undefined) {
                    angular.element($elm).text(translatorValue);
                } else {

                    ctrl.setWatcher(key, function (newValue) {
                        angular.element($elm).text(newValue);
                    });

                    $elm.bind("$destroy", ctrl.removeWatcher);
                }
            }
        };
    });

angular.module('ua.ignoreSpaces').filter('ignorespaces', function () {
    "use strict";

    var reg = new RegExp('\\s', 'gi');


    return function (array, expression, comp) {

        if (!angular.isArray(array) || (!angular.isString(expression) && !angular.isNumber(expression))) {
            return array;
        } else {

            comp = function (obj, text) {

                obj = '' + obj;
                text = '' + text;

                return obj.toLowerCase().replace(reg, '').indexOf(text.toLowerCase().replace(reg, '')) > -1;
            };

            var filtered = [], j, value,
                search = function (obj, text) {
                    var objKey, i;

                    if (typeof text === 'string' && text.charAt(0) === '!') {
                        return !search(obj, text.substr(1));
                    }

                    switch (typeof obj) {
                    case "boolean":
                    case "number":
                    case "string":
                        return comp(obj, text);
                    case "object":
                        for (objKey in obj) {
                            if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
                                return true;
                            }
                        }
                        return false;
                    case "array":
                        for (i = 0; i < obj.length; i++) {
                            if (search(obj[i], text)) {
                                return true;
                            }
                        }
                        return false;
                    default:
                        return false;
                    }
                };

            for (j = 0; j < array.length; j++) {
                value = array[j];
                if (search(value, expression)) {
                    filtered.push(value);
                }
            }

            return filtered;
        }
    };
});

/**
 * @ngdoc directive
 * @name ovhDirectives.directive:inputNumber
 * @element A
 *
 * @decription
 * Input type="number" polyfill.
 * Compatible with HTML5 attributes "min", "max", and "step".
 * It can takes negatives and floating values.
 * User can increase/decrease value with "+" and "-" buttons, with keyboard arrows, or with the mouse wheel.
 * User can let the button down for increase/decrease value (with a little tempo and debounced), to avoid the "click click click ..." in the button :).
 * Put the attr "disabled" to the input will correctly disable buttons. Same for ng-hide and ng-show.
 * Style updated for Bootstrap.
 *
 * @version 1.0.0
 *
 * @example
 * <input type="number" data-ng-model="aaaa.bbbb" min="1" max="99" step="5" data-input-number />
 *
 * or, to force the utilisation:
 *
 * <input type="text" data-ng-model="aaaa.bbbb" min="1" max="99" step="5" data-input-number="text" />
 *
 *
 * @see HTML5 Number polyfill | Jonathan Stipe | https://github.com/jonstipe/number-polyfill
 */
angular.module('ua.inputNumber').directive('inputNumber',
['$http', '$compile', '$document',
function ($http, $compile, $document) {
    'use strict';
    return {
        restrict : 'A',
        require  : '?ngModel',
        link     : function ($scope, el, attrs, ngModel) {

            var i, getParams, clipValues, extractNumDecimalDigits, matchStep, increment, decrement, domMouseScrollHandler, mouseWheelHandler;

            i = document.createElement('input');
            i.setAttribute('type', 'number');

            if (attrs.inputNumber === 'text' || i.type === 'text') {

                getParams = function() {
                    var step = attrs.step,
                        min = attrs.min,
                        max = attrs.max,
                        val = parseFloat(el.val());
                    step = /^-?\d+(?:\.\d+)?$/.test(step) ? parseFloat(step) : null;
                    min = /^-?\d+(?:\.\d+)?$/.test(min) ? parseFloat(min) : null;
                    max = /^-?\d+(?:\.\d+)?$/.test(max) ? parseFloat(max) : null;
                    if (isNaN(val)) {
                        val = min || 0;
                    }
                    return {
                        min: min,
                        max: max,
                        step: step,
                        val: val
                    };
                };

                clipValues = function(value, min, max) {
                    if ((max != null) && value > max) {
                        return max;
                    } else if ((min != null) && value < min) {
                        return min;
                    } else {
                        return value;
                    }
                };

                extractNumDecimalDigits = function(input) {
                    if (input != null) {
                        var num = 0,
                            raisedNum = input;
                        while (raisedNum !== Math.round(raisedNum)) {
                            num += 1;
                            raisedNum = input * Math.pow(10, num);
                        }
                        return num;
                    } else {
                        return 0;
                    }
                };

                matchStep = function(value, min, max, step) {
                    var mod,
                        raiseTo,
                        raisedMod,
                        raisedStep,
                        raisedStepDown,
                        raisedStepUp,
                        raisedValue,
                        stepDown,
                        stepUp,
                        stepDecimalDigits = extractNumDecimalDigits(step);

                    if (step == null) {
                        return value;
                    } else if (stepDecimalDigits === 0) {
                        mod = (value - (min || 0)) % step;
                        if (mod === 0) {
                            return value;
                        } else {
                            stepDown = value - mod;
                            stepUp = stepDown + step;
                            if ((stepUp > max) || ((value - stepDown) < (stepUp - value))) {
                                return stepDown;
                            } else {
                                return stepUp;
                            }
                        }
                    } else {
                        raiseTo = Math.pow(10, stepDecimalDigits);
                        raisedStep = step * raiseTo;
                        raisedMod = (value - (min || 0)) * raiseTo % raisedStep;
                        if (raisedMod === 0) {
                            return value;
                        } else {
                            raisedValue = value * raiseTo;
                            raisedStepDown = raisedValue - raisedMod;
                            raisedStepUp = raisedStepDown + raisedStep;
                            if (((raisedStepUp / raiseTo) > max) || ((raisedValue - raisedStepDown) < (raisedStepUp - raisedValue))) {
                                return raisedStepDown / raiseTo;
                            } else {
                                return raisedStepUp / raiseTo;
                            }
                        }
                    }
                };

                increment = function() {
                    if (!el.is(":disabled")) {
                        var params = getParams(),
                            raiseTo = Math.pow(10, Math.max(extractNumDecimalDigits(params.val), extractNumDecimalDigits(params.step))),
                            newVal = (Math.round(params.val * raiseTo) + Math.round((params.step || 1) * raiseTo)) / raiseTo;

                        if ((params.max != null) && newVal > params.max) {
                            newVal = params.max;
                        }
                        newVal = matchStep(newVal, params.min, params.max, params.step);

                        $scope.$apply(function() {
                            ngModel.$setViewValue(newVal);
                        });
                    }
                };

                decrement = function() {
                    if (!el.is(":disabled")) {
                        var params = getParams(),
                            raiseTo = Math.pow(10, Math.max(extractNumDecimalDigits(params.val), extractNumDecimalDigits(params.step))),
                            newVal = (Math.round(params.val * raiseTo) - Math.round((params.step || 1) * raiseTo)) / raiseTo;

                        if ((params.min != null) && newVal < params.min) {
                            newVal = params.min;
                        }
                        newVal = matchStep(newVal, params.min, params.max, params.step);

                        $scope.$apply(function() {
                            ngModel.$setViewValue(newVal);
                        });
                    }
                };

                domMouseScrollHandler = function(e) {
                    e.preventDefault();
                    if (e.originalEvent.detail < 0) {
                        increment();
                    } else {
                        decrement();
                    }
                };

                mouseWheelHandler = function(e) {
                    e.preventDefault();
                    if (e.originalEvent.wheelDelta > 0) {
                        increment();
                    } else {
                        decrement();
                    }
                };


                /*==========  INIT  ==========*/

                $http.get('components/ovh-utils-angular/inputNumber/inputNumber.html').then(function (template) {

                    var $template = $compile(template.data)($scope),
                        $upBtn = $template.find('.input-number-btn-up'),
                        $downBtn = $template.find('.input-number-btn-down');

                    el.after($template);

                    $scope.$watch(attrs.ngModel, function (nV) {
                        el.val(nV);
                    });

                    if (angular.isDefined(attrs.ngHide)) {
                        $scope.$watch(attrs.ngHide, function (nV) {
                            if ($scope.$eval(nV)) {
                                $template.hide();
                            } else {
                                $template.show();
                            }
                        });
                    }

                    if (angular.isDefined(attrs.ngShow)) {
                        $scope.$watch(attrs.ngShow, function (nV) {
                            if ($scope.$eval(nV)) {
                                $template.show();
                            } else {
                                $template.hide();
                            }
                        });
                    }

                    el.bind({
                        focus: function() {
                            el.bind({
                                DOMMouseScroll: domMouseScrollHandler,
                                mousewheel: mouseWheelHandler
                            });
                        },
                        blur: function() {
                            el.unbind({
                                DOMMouseScroll: domMouseScrollHandler,
                                mousewheel: mouseWheelHandler
                            });
                        },
                        keypress: function(e) {
                            var _ref, _ref1;
                            if (e.keyCode === 38) {
                                increment();
                            } else if (e.keyCode === 40) {
                                decrement();
                            } else if (((_ref = e.keyCode) !== 8 && _ref !== 9 && _ref !== 35 && _ref !== 36 && _ref !== 37 && _ref !== 39) && ((_ref1 = e.which) !== 45 && _ref1 !== 46 && _ref1 !== 48 && _ref1 !== 49 && _ref1 !== 50 && _ref1 !== 51 && _ref1 !== 52 && _ref1 !== 53 && _ref1 !== 54 && _ref1 !== 55 && _ref1 !== 56 && _ref1 !== 57)) {
                                e.preventDefault();
                            }
                        },
                        change: function(e) {
                            if (e.originalEvent != null) {
                                var params = getParams(),
                                    newVal = clipValues(params.val, params.min, params.max);
                                newVal = matchStep(newVal, params.min, params.max, params.step, params.stepDecimal);

                                $scope.$apply(function() {
                                    ngModel.$setViewValue(newVal);
                                });
                            }
                        }
                    });

                    $upBtn.bind('mousedown', function() {
                        var releaseFunc, timeoutFunc;
                        increment();
                        timeoutFunc = function(incFunc) {
                            incFunc();
                            el.data('timeoutID', window.setTimeout(timeoutFunc, 10, incFunc));
                        };
                        releaseFunc = function() {
                            window.clearTimeout(el.data('timeoutID'));
                            $document.unbind('mouseup', releaseFunc);
                            $upBtn.unbind('mouseleave', releaseFunc);
                        };
                        $document.bind('mouseup', releaseFunc);
                        $upBtn.bind('mouseleave', releaseFunc);
                        el.data('timeoutID', window.setTimeout(timeoutFunc, 700, increment));
                    });

                    $downBtn.bind('mousedown', function() {
                        var releaseFunc, timeoutFunc;
                        decrement();
                        timeoutFunc = function(decFunc) {
                            decFunc();
                            el.data('timeoutID', window.setTimeout(timeoutFunc, 10, decFunc));
                        };
                        releaseFunc = function() {
                            window.clearTimeout(el.data('timeoutID'));
                            $document.unbind('mouseup', releaseFunc);
                            $downBtn.unbind('mouseleave', releaseFunc);
                        };
                        $document.bind('mouseup', releaseFunc);
                        $downBtn.bind('mouseleave', releaseFunc);
                        el.data('timeoutID', window.setTimeout(timeoutFunc, 700, decrement));
                    });

                })["catch"](function () {
                    throw 'Error template u-a inputNumber';
                });

            }
        }
    };
}]);

/**
 * @type directive
 * @name ovhDirectives:logger
 * @see [url=http://docs.angularjs.org/guide/ie]Internet Explorer Compatibility[/url]
 * @version 1.0.0
 * @description
 * Provide div for the Logger Services .
 * # Require
 * [url=#/module=ovhServices&service=Logger]`Logger`[/url] service on controller view.
 * As attribute:
 *<code:html>
 *<div data-logger data-logger-prefix="~$" style="height:75px;overflow:auto;" class="span7 alert" />
 *</code>
 * In controller
 * <code:js>
 * var Ctrl = function (Logger) {
 * Loggger.log('info', 'info log');
 * Loggger.log('warning', 'warn log');
 * Loggger.log('error', 'error log');
 * Loggger.log('success', 'success log');
 * };
 * Ctrl.$inject = ['Logger'];
 * </code>
 * Result :
 * <code:html>
 * <div data-logger-prefix="&gt;" data-logger="" style="height:75px;overflow:auto;" class="span7 alert ng-isolate-scope ng-scope">
 * <!-- ngRepeat: message in messages -->
 * <p class="text-info">~$>info log</p>',
 * <p class="text-warning">~$>warn log</p>',
 * <p class="text-error">~$>error log</p>',
 * <p class="text-success">~$>success log</p>',
 * </div>
 * </code>
*/
angular.module('ua.logger').directive('logger', ['Logger', function () {
    'use strict';
    return {
        restrict: 'A',
        scope: {
            prefix: '@loggerPrefix'
        },
        template: '<p data-ng-repeat="message in messages" class="text-{{message.type|lowercase}}">{{prefix}} {{message.message}}</p>',
        link: function (scope) {
            var messages = scope.messages = [];

            scope.$on('loggerLog', function (evt, msg) {
                messages = $.merge(messages, msg);
            });
        }
    };
}]);

/**
 * @type service
 * @name ovhServices:Logger
 * @see [url=#/module=ovhDirectives&directive=logger]`logger`[/url] service on controller view.
 * @description
 * When you call a Logger function, an event will be broadcast by the rootscope
 * Add `Logger` service into Your controller
 * @example
 * Equivalent level info example
 * <code:js>
 * var Ctrl = function (Logger) {
 * Loggger.log('info', 'info log');
 * Logger.info('info log');
 * Logger.info(['info', 'log']); //two logs
 * Logger.log({
 *  type: 'info',
 *  message: 'info log'
 * });
 * Logger.info(['info', { // two logs
 *    message: 'log'
 * }]);
 *</code>
 * Equivalent level warn example
 * <code:js>
 * Loggger.log('warning', 'warn log');
 * Logger.warning('warn log');
 * Logger.warning(['warn', 'log']); //two logs
 * Logger.log({
 *  type: 'warning',
 *  message: 'warn log'
 * });
 * Logger.warning(['info', { //two logs
 *  message: 'log'
 * }]);
 *</code>
 * Equivalent error example
 * <code:js>
 * Loggger.log('error', 'error log');
 * Logger.error('error log');
 * Logger.error(['error','log']); //two log
 * Logger.log({
 *  type: 'error',
 *  message: 'error log'
 * });
 * Logger.error(['error', { //two log
 *  message: 'log'
 * }]);
 *</code>
 * Level success example
 * <code:js>
 * Loggger.log('success', 'success log');
 * Logger.success('success log');
 * Logger.success(['success', 'log']); //two logs
 * Logger.log({
 *  type: 'success',
 *  message: 'success log'
 * });
 * Logger.success(['success', { //two logs
 *  message: 'log'
 * }]);
 *</code>
 * Multi level log
 * <code:js>
 * // one error, one succes, one info
 * Logger.log([{
 *  type: 'error',
 *  message : 'error log'
 * }, {
 *  type: 'success',
 *  message: 'succes log'
 * }, {
 *  type: 'info'
 *  message: 'message info'
 * }]);
 *</code>
 * Overwriting log level by logged object
 * <code:js>
 * Logger.info({ // log on error
 *  type: 'error'
 *  message: 'error log'
 * });
 * // two succes, one error
 * Logger.success(['it is a success', {
 *  message: 'it is a success too !'
 * }, {
 *  type: 'error',
 *  message: 'damned it is an erro'
 * }]);
 * };
 * Ctrl.$inject = ['Logger'];
 * </code>
 */
angular.module('ua.logger').service('Logger', ['$rootScope', function (rootScope) {
    'use strict';
    var fireLog  = function (messages) {
        rootScope.$broadcast('loggerLog', messages);
    };

    /**
     * @type function
     * @name ovhServices:Logger.log
     * @description
     * fire `loggerLog` event
     * if you log an object, your object must have an 'message' attributs. If the object have `type`, the logger log with it `type`.
     * @param {*|array[string|object|int]} {a} if string, it can be the level log if you have a seconde arguments. Otherwise the thing that you want to log.
     * @param {*} {b} OPTIONAL - the thing that you want to log
     **/
    this.log = function (a, b) {
        var messages = [];

        //We have two arguments
        if (b !== undefined && b !== null) {
            if (angular.isArray(b)) {
                angular.forEach(b, function (item) {
                    if (angular.isString(item)) {
                        messages.push({
                            type: a,
                            message: item
                        });
                    } else if (angular.isObject(item)) {
                        messages.push({
                            type: item.type || a,
                            message: item.message || ''
                        });
                    }
                });
            } else if (angular.isObject(b)) {
                messages.push({
                    type: b.type || a,
                    message: b.message || ''
                });
            } else if (angular.isString(b)) {
                messages.push({
                    type: a,
                    message: b
                });
            } else {
                messages.push({
                    type: 'info',
                    message: b + ''
                });
            }
        } else {
            // We only have one arguments
            if (angular.isArray(a)) {
                angular.forEach(a, function (item) {
                    if (angular.isString(item)) {
                        messages.push({
                            type: 'info',
                            message: item
                        });
                    } else if (angular.isObject(item)) {
                        messages.push({
                            type: item.type || 'info',
                            message: item.message || ''
                        });
                    }
                });
            } else if (angular.isObject(a)) {
                messages.push({
                    type: a.type || 'info',
                    message: a.message || ''
                });
            } else if (angular.isString(a)) {
                messages.push({
                    type: 'info',
                    message: a
                });
            } else {
                messages.push({
                    type: 'info',
                    message: a + ''
                });
            }
        }

        if (messages.length > 0) {
            fireLog(messages);
        }
    };
    /**
     * @type function
     * @name ovhServices:Logger.info
     * @description
     * fire `loggerLog` with info level
     * @param {*} the thing to log
     **/
    this.info = function (messages) {
        this.log('info', messages);
    };
    /**
     * @type function
     * @name ovhServices:Logger.warning
     * @description
     * fire `loggerLog` with warning level
     * @param {*} the thing to log
     **/
    this.warning = function (messages) {
        this.log('warning', messages);
    };
    /**
     * @type function
     * @name ovhServices:Logger.error
     * @description
     * fire `loggerLog` with error level
     * @param {*} the thing to log
     **/
    this.error = function (messages) {
        this.log('error', messages);
    };
    /**
     * @type function
     * @name ovhServices:Logger.success
     * @description
     * fire `loggerLog` with success level
     * @param {*} the thing to log
     **/
    this.success = function (messages) {
        this.log('success', messages);
    };
}]);

/**
 * @ngdoc filter
 * @name ovhFilters.filter:moment
 *
 * @example
 * <h1>Date formatted: {{date | moment:'MM/DD/YYYY HH:m A'}}</h1>
 */
angular.module('ua.moment').filter('moment', function () {
    "use strict";

    return function (date, format) {
        if (angular.isString(date) && !window.moment(date, format).isValid()) {
            return null;
        }
        return window.moment(date).format(format);
    };

});

/**
 * @type service
 * @name ovhServices:Navigator
 * @description
 * Provide navigation system
 * @example
 * # Usage
 * <code:js>
 * var TopNavigationCtrl = function ($scope, $location, Navigator) {
 *     "use strict";
 *
 *      $scope.go = function (section) {
 *          Navigator.navigate(section);
 *       };
 * };
 *
 * TopNavigationCtrl.$inject = ['$scope', '$location', 'Navigator'];
 * </code>
 */
angular.module('ua.navigator').service('Navigator', ['$rootScope', '$location', function ($rootScope, $location) {
    "use strict";

    //just check param
    function isGoodParams(level, value) {
        return angular.isNumber(level) && angular.isString(value) && value.replace(/ /g, '') !== '';
    }

    //remove space form tab
    function trimTab(tab) {
        angular.forEach(tab, function (item, idx) {
            if (item.replace(/ /g, '') === '') {
                tab.splice(idx, 1);
            }
        });
        return tab;
    }

    var pathes = trimTab($location.path().split('/')),
        navigationInformations = {},
        self = this;

    // Update pathes on routechange
    $rootScope.$on('$routeChangeSuccess', function () {
        pathes = trimTab($location.path().split('/'));
    });

    function constructPath(fakePath) {
        var returnPath = '';

        if (fakePath) {
            returnPath = '/' + trimTab(fakePath).join('/');
        } else {
            returnPath = '/' + trimTab(pathes).join('/');
        }

        return returnPath;
    }

    /**
     * @type function
     * @name ovhServices:Navigator.setNavigationInformation
     * @description
     * store some useful informations for navigation to use in resolve for instance.
     * @param {Object} the config Object
     */
    this.setNavigationInformation = function (c) {
        if (angular.isObject(c) && c) {
            navigationInformations = c;
            $rootScope.$broadcast('Navigator.navigationInformationsChange', navigationInformations);
        }
        return self;
    };

    /**
     * @type function
     * @name ovhServices:Navigator.getNavigationInformations
     * @description
     * store some useful informations for navigation to use in resolve for instance.
     * @param {Object} the config Object
     */
    this.getNavigationInformation = function (k) {
        if (k === undefined) {
            return navigationInformations || null;
        }
        if (angular.isString(k)) {
            return navigationInformations[k] || null;
        }
        if (angular.isArray(k)) {
            var returnObj = {},
                l = k.length;

            for (l ; l-- ;) {
                returnObj[k[l]] = navigationInformations[k[l]];
            }

            return  returnObj;

        }
        return navigationInformations || null;
    };

    /**
     * @type function
     * @name ovhServices:Navigator.navigate
     * @description
     * navigate in the app
     * @param {string} path the path you want to go
     */
    this.navigate = function(path) {
        var inPhase = true,
            newPath = '';

        inPhase = (function () {
            var phase = $rootScope.$$phase;
            return phase === '$digest' || phase === '$apply';
        })();

        newPath = (function (p) {
            if (angular.isString(p) && p !== '') {
                return p.indexOf('/') === 0 ? p : '/' + p;
            } else {
                return constructPath();
            }
        })(path);

        if (newPath !== $location.path()) {
            if (inPhase) {
                $location.path(newPath);
            } else {
                $rootScope.$apply(function () {
                    $location.path(newPath);
                });
            }
        }
    };

    /**
     * @type function
     * @name ovhServices:Navigator.setNavigationLevel
     * @description
     * return the stored data
     */
    this.setNavigationLevel = function () {
        var level, value,
            i = 0,
            args = arguments,
            l = args.length;

        if (l % 2 === 0) {
            for (i ; i < l ; i += 2) {

                level = args[i];
                value = args[i+1];

                if (isGoodParams(level, value)) {
                    if (pathes.length > level) {
                        pathes[level] = value;
                    } else {
                        pathes.push(value);
                    }

                }
            }
            this.navigate();
        }

    };
}]);

/**
 * @type directive
 * @name ovhDirectives:paginationServerSide
 * @description
 * Allow to create a server side pagination compatible with AbstractPaginatedBean defined Java side
 *
 * Support these attributes to tune the directive :
 *      data-pagination-server-side="anId" String id
 *      data-pagination-server-side-function="loadPageFunction" Function defined in the scope
 *      data-pagination-server-side-paginated-stuff="paginatedBean" Variable defined in the scope
 *      data-pagination-server-side-table-loading="tableIsLoading" Variable defined in the scope
 *      data-pagination-server-side-page-size-available="table"    Variable defined in the scope
 *      data-pagination-server-side-datas="paginatedBean.path.to.datas"
 *
 * The supported events are :
 *     'paginationServerSide.reload'
 *     'paginationServerSide.loadPage'
 *
 * # Usage
 * - The attribute data-pagination-server-side is optionnal
 *  You can use this to identify pagination table when page that contains more than one
 * - The attribute data-pagination-server-side-function is mandatory
 *  The loadPageFunction have to take 2 arguments :
 *      $scope.loadPageFunction= function (count, offset) {};
 *      Where count is the number of lines to display in the table.
 *      Where offset is the number of lines skip in the table (to allow to display the desired page).
 * - The attribute data-pagination-server-side-paginated-stuff is mandatory
 * - The attribute data-pagination-server-side-table-loading is mandatory
 *  Basically tableIsLoading should be set to true when you will get the datas from ws (in the loadPageFunction), and reseted to false when you get the response.
 *
 * - The attribute data-pagination-server-side-page-size-available is optional
 *  You can use this to change the default list of available page size (default is [10, 20, 40])
 *  The variable have to be a table containing numbers or the string 'all'
 *
 *  - The attribute data-pagination-server-side-datas is optional
 *  If set, datas are watched to automaticaly reload or change page when emptied
 *
 * # Event
 * For you controller you can broadcast events that will be handled by the directive.
 * For example, if you want to ask the ALL the directives to load a specific page :
 *      var iWantToLoadThisPage = 42;
 *      $scope.$broadcast('paginationServerSide.loadPage', iWantToLoadThisPage);
 * For example, if you want to ask to a single directive to load a specific page :
 *      $scope.$broadcast('paginationServerSide.loadPage', iWantToLoadThisPage, anId);
 */
angular.module('ua.paginationServerSide').directive('paginationServerSide',
['$translate',
function ($translate) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        scope: {
            paginationServerSideFunction: '=',
            paginationServerSidePaginatedStuff: '=',
            paginationServerSideTableLoading: '=',
            paginationServerSidePageSizeAvailable: '=',
            paginationServerSideDatas: '='
        },
        templateUrl: 'components/ovh-utils-angular/paginationServerSide/paginationServerSide.html',
        link: function ($scope, $elem, $attr) {

            function checkForGlobalOrId (id) {
                return !id || ($attr.paginationServerSide && id === $attr.paginationServerSide);
            }

            // watch datas and reload or change page if empty
            $scope.$watch('paginationServerSideDatas.length', function (newValue, oldValue) {
                if (oldValue && !newValue) {
                    if ($scope.paginationServerSidePaginatedStuff.pagination.length > 1) {
                        if ($scope.currentPage > 1) {
                            $scope.loadPage($scope.currentPage - 1, true);
                        } else {
                            $scope.loadPage($scope.currentPage, true);
                        }
                    }
                }
            });

            $elem.bind('change', '.pagination-page-input', function () {
                $elem.find('.pagination-page-goto').click();
                $elem.find('.pagination-page-input').blur();
            });

            $scope.goToPage = null;
            $scope.currentPage = null;

            if ($scope.paginationServerSidePageSizeAvailable && Array.isArray($scope.paginationServerSidePageSizeAvailable)) {
                $scope.pageSizeAvailable = $scope.paginationServerSidePageSizeAvailable;
                $scope.pageSize = $scope.pageSizeAvailable[0];
            } else {
                $scope.pageSizeAvailable = [5, 10, 20, 40, 80, 100];
                $scope.pageSize = $scope.pageSizeAvailable[1];
            }

            $scope.getSizeLabel = function (size) {
                return size === 'all' ? $translate.instant('pagination_display_all') : size;
            };

            // events
            $scope.$on('paginationServerSide.loadPage', function (event, pageToLoad, id) {
                if (checkForGlobalOrId(id)) {
                    $scope.loadPage(pageToLoad, true);
                }
            });

            $scope.$on('paginationServerSide.reload', function (event, id) {
                if (checkForGlobalOrId(id)) {
                    $scope.loadPage($scope.currentPage, true);
                }
            });
            // /events

            if (localStorage != null) {
                var itemsPerPage = localStorage.getItem('pagination_front_items_per_page');

                if (!_.isNumber(itemsPerPage)) {
                    itemsPerPage = parseInt(itemsPerPage, 10);
                }

                $scope.pageSize = itemsPerPage;
            }

            if (!_($scope.pageSize).isFinite()) {
                $scope.pageSize = 10;
            }

            $scope.$watch('pageSize', function (newValue, oldValue) {
                if (newValue && newValue !== oldValue &&!$scope.paginationServerSideTableLoading) {
                    if (newValue === 'all') {
                        $scope.pageSize = $scope.paginationServerSidePaginatedStuff.count;
                    } else {
                        if ($scope.currentPage > $scope.getLastPageNumber()) {
                            $scope.currentPage = $scope.getLastPageNumber();
                        }
                        $scope.loadPage($scope.currentPage, true);
                    }
                    if (localStorage){
                        localStorage.setItem('pagination_front_items_per_page',newValue);
                    }
                }
            });

            $scope.getLastPageNumber = function () {
                if ($scope.paginationServerSidePaginatedStuff) {
                    return Math.ceil($scope.paginationServerSidePaginatedStuff.count / $scope.pageSize);
                }
                else {
                    return null;
                }
            };

            $scope.getPaginationNumbersClasses = function (page) {
                if ($scope.currentPage === page) {
                    return "active ";
                }
            };

            $scope.getPaginationPreviousClasses = function () {
                if ($scope.paginationServerSideTableLoading || $scope.currentPage === 1) {
                    return "disabled ";
                }
            };

            $scope.getPaginationNextClasses = function () {
                if ($scope.paginationServerSideTableLoading || ($scope.paginationServerSidePaginatedStuff && Math.ceil($scope.paginationServerSidePaginatedStuff.count / $scope.pageSize) === $scope.currentPage)) {
                    return "disabled ";
                }
            };

            $scope.getGoToPageClasses = function () {
                if ($scope.paginationServerSideTableLoading) {
                    return "disabled ";
                }
            };

            $scope.loadPage = function (page, forceReload) {
                if (page) {
                    $scope.goToPage = null;
                    var pageToLoad = Math.ceil(page);
                    var currentPageIsLastPage = $scope.paginationServerSidePaginatedStuff && Math.ceil($scope.paginationServerSidePaginatedStuff.count / $scope.pageSize) === $scope.currentPage;
                    var nextPageIsAfterCurrentPage = pageToLoad > $scope.currentPage;

                    if (currentPageIsLastPage && nextPageIsAfterCurrentPage) {
                        return;
                    }

                    var pageIsLoading = $scope.paginationServerSideTableLoading;

                    var pageToLoadIsCurrentPage = $scope.currentPage === pageToLoad;
                    var tableShouldLoad = forceReload || !pageToLoadIsCurrentPage;

                    var askedPageParameterIsCorrect = pageToLoad >= 1;

                    var thereArePaginatedElements = $scope.paginationServerSidePaginatedStuff != null;
                    var thereIsEnoughElementsToDisplay = thereArePaginatedElements && (pageToLoad - 1) * $scope.pageSize <= $scope.paginationServerSidePaginatedStuff.count;

                    if (!pageIsLoading && tableShouldLoad && askedPageParameterIsCorrect && (!thereArePaginatedElements || thereIsEnoughElementsToDisplay)) {
                        $scope.currentPage = pageToLoad;
                        $scope.paginationServerSideFunction($scope.pageSize, (pageToLoad - 1) * $scope.pageSize);
                    }

                    return false;
                }

                return false;
            };

            $scope.loadPage(1);
        }
    };
}]);

angular.module('ua.poll').service('Poll',
    ['$q', '$timeout', '$http',
    function ($q, $timeout, $http) {
    'use strict';

    var defaultInterval = 7e3,
        tasks = [];

    this.poll = function (url, apiOpts, pollOpts) {

        if (!apiOpts) {
            apiOpts = {};
        }
        if (!pollOpts) {
            pollOpts = {};
        }

        // Try to get similar polling
        var simTask = _.find(tasks, { url: url, scope: pollOpts.scope || null, namespace: pollOpts.namespace || null });
        if (simTask) {
            return simTask.deferredObj.promise;
        }

        // --> Else, create it
        var timeoutDeferredObj = $q.defer();
        var task = angular.extend({
            deferredObj        : $q.defer(),
            timeoutDeferredObj : timeoutDeferredObj,
            url                : url,
            opts               : angular.extend(apiOpts, { 'timeout': timeoutDeferredObj.promise }),
            interval           : defaultInterval,    // Interval between polling
            lastResult         : null,    // Last polled result
            successRule        : null,    // (optional) success condition (if not a task)
            errorRule          : null,    // (optional) Error condition (if not a task)
            scope              : null,    // (optional) Scope ID (to isolate polling)
            namespace          : null     // (optional) Type of namespace, can be whatever you want (to isolate polling)
        }, pollOpts);

        tasks.push(task);

        run(task);

        return task.deferredObj.promise;
    };

    this.kill = function (pattern) {
        var killedTasks = _.filter(tasks, pattern);
        if (killedTasks.length) {
            angular.forEach(killedTasks, function (task) {
                task.timeoutDeferredObj.resolve();
                task.deferredObj.reject({});
                $timeout.cancel(task.timeoutPromise);
            });
            _.remove(tasks, pattern);
        }
    };

    // ---

    function resolveTask (task, result) {
        task.deferredObj.resolve(result);
        _.remove(tasks, task);
    }
    function rejectTask (task, result) {
        task.deferredObj.reject(result);
        _.remove(tasks, task);
    }
    function notifyTask (task, result) {
        task.deferredObj.notify(result);
        task.lastResult = angular.copy(result);
        run(task);    // Re-launch
    }

    function run (task) {
        task.timeoutPromise = $timeout(function () {
            poll(task);
        }, task.interval);
    }

    function poll (task) {
        $http.get(task.url, task.opts).then(function (result) {
            result = result.data;

            if (task.successRule) {
                // It's not a task, it's a specific polling

                var inSuccess = true;
                angular.forEach(task.successRule, function (val, key) {
                    if (result[key] !== val) {
                        inSuccess = false;
                    }
                });

                if (inSuccess) {
                    return resolveTask(task, result);
                }

                if (task.errorRule) {
                    var inError = true;
                    angular.forEach(task.errorRule, function (val, key) {
                        if (result[key] !== val) {
                            inError = false;
                        }
                    });

                    if (inError) {
                        return rejectTask(task, result);
                    }
                }

                return notifyTask(task, result);

            } else {
                // It's a /task polling

                switch (result.status) {
                case 'done':
                case 'cancelled':
                case 'DONE':
                case 'CANCELLED':
                    resolveTask(task, result);
                    break;
                case 'customerError':
                case 'ovhError':
                case 'error':
                case 'blocked':
                case 'CUSTOMER_ERROR':
                case 'OVH_ERROR':
                case 'ERROR':
                case 'BLOCKED':
                    rejectTask(task, result);
                    break;
                default:
                    notifyTask(task, result);
                }
            }

        }, function (error) {
            if (error.status === 404) {      // deleted
                return resolveTask(task, task.lastResult);
            } else if (error.status !== 0) {       // status === 0 : killed
                return rejectTask(task, error.data);
            }
        });
    }

}]);

angular.module('ua.popover').directive('linkedpopoverPopup', function () {
    "use strict";
    return {
        restrict  : 'A',
        replace   : true,
        template  : '<div class="popover {{ttPlacement}} fade" data-ng-class="{ in: tooltipIsOpen}" id="{{tooltipId}}">' +
        '<div class="arrow"></div>' +
        '<div class="popover-inner">' +
        '<div class="popover-title popover-title-input" data-ng-bind="ttTitle"></div>' +
        '<div class="popover-content">' +
        '<div data-ng-if="ttRemote == \'true\'" data-ng-include="ttContent"></div>'+
        '<div data-ng-if="ttRemote != \'true\'" data-ng-bind-html="ttContent"></div>' +
        '</div>' +
        '</div>' +
        '</div>'
    };
}).directive('linkedpopover', ['popoverFactory', function (popover) {
    "use strict";
    return popover('linkedpopover', 'click');
}]);

angular.module('ua.popover').provider('popoverFactory', function () {
    "use strict";

    var defaultOptions,
        triggerMap,
        globalOptions;

    defaultOptions = {
        placement   : 'top',
        animation   : true,
        popupDelay  : 0
    };

    triggerMap = {
        mouseenter  : 'mouseleave',
        click       : 'click',
        focus       : 'blur'
    };

    globalOptions = {};

    this.options = function (value) {
        angular.extend(globalOptions, value);
    };

    this.setTriggers = function setTriggers (triggers) {
        angular.extend(triggerMap, triggers);
    };

    function snakeCase (name) {
        return name.replace(/[A-Z]/g, function (letter, pos) {
            return (pos ? '-' : '') + letter.toLowerCase();
        });
    }

    function getPosition(element) {
        var el = element[0];

        return $.extend({}, angular.isFunction(el.getBoundingClientRect) ? el.getBoundingClientRect() : {
            width  : el.offsetWidth,
            height : el.offsetHeight
        }, element.offset());
    }

    this.$get = ['$compile', '$parse', '$document', '$interpolate', '$rootScope',
        function ($compile,   $parse,   $document,   $interpolate,   $rootScope) {
            return function (type, defaultTriggerShow) {
                var options,
                prefix = angular.copy(type),
                directiveName,
                triggers,
                startSym,
                endSym,
                template,
                tooltipId;

                function setTriggers(trigger) {
                    var show,
                    hide;

                    show = trigger || options.trigger || defaultTriggerShow;

                    if (angular.isDefined(options.trigger)) {
                        hide = triggerMap[options.trigger] || show;
                    } else {
                        hide = triggerMap[show] || show;
                    }

                    return {
                        show : show,
                        hide : hide
                    };
                }

                function init() {
                    options       = angular.extend({}, defaultOptions, globalOptions);
                    directiveName = snakeCase(type);
                    triggers      = setTriggers();
                    startSym      = $interpolate.startSymbol();
                    endSym        = $interpolate.endSymbol();
                    template      = '<div data-' + directiveName + '-popup ' +
                                    'data-popover-tooltip-title="' + startSym + 'ttTitle' + endSym + '"' +
                                    'data-popover-tooltip-content="' + startSym + 'ttContent' + endSym + '" ' +
                                    'data-popover-tooltip-placement="' + startSym + 'ttPlacement' + endSym + '" ' +
                                    'data-popover-tooltip-remote="' + startSym + 'ttRemote' + endSym +'" ' +
                                    'data-popover-tooltip-single="' + startSym +'ttSingle' + endSym + '"' +
                                    'data-popover-tooltip-is-open="tooltipIsOpen" ' +
                                    'data-popover-tooltip-id="' + tooltipId + '"></div>';
                }

                return {
                    restrict       : 'A',
                    transclude     : true,
                    template       : '<div ng-transclude></div>',
                    scope          : true,
                    link           : function ($scope, element, attrs) {
                        tooltipId = 'popover' + $scope.$id;

                        init();

                        element.addClass('popover-trigger');

                        var body = angular.element('body');

                        function broadcaster (e) {
                            var tooltipElement = angular.element('#' + tooltipId)[0];

                            if (tooltipElement) {
                                var clickIsInsideTooltip = tooltipElement.contains(e.target);

                                if (!clickIsInsideTooltip) {
                                    $rootScope.$broadcast('popover.clickbody');
                                }
                            } else {
                                $rootScope.$broadcast('popover.clickbody');
                            }
                        }

                        body.bind('click', broadcaster);

                        $scope.$on('$destroy', function () {
                            body.unbind('click', broadcaster);
                        });

                        var tooltip              = $compile(template)($scope),
                        isTooltipExist       = false;

                        $scope.tooltipIsOpen = false;

                        $scope.hide = function () {
                            hide();
                        };

                        function stopEvent(evt) {
                            if (evt && evt.stopPropagation) {
                                evt.stopPropagation();
                            }
                        }

                        function toggleTooltipBind (evt) {
                            stopEvent(evt);
                            if ($scope.tooltipIsOpen === false) {
                                showTooltipBind(evt);
                            } else {
                                hideTooltipBind(evt);
                            }
                        }

                        // Show the tooltip with delay if specified, otherwise show it immediately
                        function showTooltipBind (evt) {
                            stopEvent(evt);
                            if ($scope.tooltipIsOpen === false) {
                                $rootScope.$broadcast('popover.show', element, $scope.ttSingle);
                                $scope.$apply(show);
                            }
                        }

                        function hideTooltipBind (evt) {
                            stopEvent(evt);
                            if ($scope.tooltipIsOpen === true) {
                                $scope.$apply(function () {
                                    hide();
                                });
                            }
                        }

                        function managePlacement (tooltip) {

                            var position,
                                ttWidth,
                                ttHeight,
                                ttPosition,
                                mousePos;

                            // Get the position of the directive element.
                            position = options.appendToBody ? getPosition().offset(element) : getPosition(element);

                            // Get the height and width of the tooltip so we can center it.
                            ttWidth = tooltip.prop('offsetWidth');
                            ttHeight = tooltip.prop('offsetHeight');

                            // Calculate the tooltip's top and left coordinates to center it with
                            // this directive.
                            switch ($scope.ttPlacement) {
                            case 'mouse':
                                mousePos = getPosition.mouse();
                                ttPosition = {
                                    top     : mousePos.y,
                                    left    : mousePos.x
                                };
                                break;
                            case 'right':
                                ttPosition = {
                                    top     : position.top + position.height / 2 - ttHeight / 2,
                                    left    : position.left + position.width
                                };
                                break;
                            case 'bottom':
                                ttPosition = {
                                    top     : position.top + position.height,
                                    left    : position.left + position.width / 2 - ttWidth / 2
                                };
                                break;
                            case 'left':
                                ttPosition = {
                                    top     : position.top + position.height / 2 - ttHeight / 2,
                                    left    : position.left - ttWidth
                                };
                                break;
                            default:
                                ttPosition = {
                                    top     : position.top - ttHeight,
                                    left    : position.left + position.width / 2 - ttWidth / 2
                                };
                                break;
                            }

                            ttPosition.top += 'px';
                            ttPosition.left += 'px';
                            ttPosition.display = 'block';

                            // Now set the calculated positioning.
                            tooltip.css(ttPosition);

                            setTimeout(function() {
                                managePlacement(tooltip);
                            }, 50);
                        }

                        // Show the tooltip popup element.
                        function show () {
                            tooltip = $compile(template)($scope);
                            // Don't show empty tooltips.
                            if ($scope.ttContent) {
                                // Set the initial positioning.
                                tooltip.css({
                                    top     : 0,
                                    left    : 0,
                                    display : 'block'
                                });

                                if (!isTooltipExist) {
                                    element.after(tooltip);
                                    isTooltipExist = true;
                                }

                                managePlacement(tooltip);

                                // And show the tooltip.
                                $scope.tooltipIsOpen = true;
                            }
                        }//End show

                        // Hide the tooltip popup element.
                        function hide () {
                            if ($scope.tooltipIsOpen === true) {
                                // First things first: we don't show it anymore.
                                $scope.tooltipIsOpen = false;
                                tooltip.remove();
                                isTooltipExist = false;
                            }
                        }

                        function triggerBinding() {
                            if (triggers.show === triggers.hide) {
                                element.bind(triggers.show, toggleTooltipBind);
                            } else {
                                element.bind(triggers.show, showTooltipBind);
                                element.bind(triggers.hide, hideTooltipBind);
                            }

                            if (triggers.show === 'click') {
                                tooltip.bind('click', stopEvent);
                            } else {
                                tooltip.unbind('click', stopEvent);
                            }
                        }

                        /**
                         * Observe the relevant attributes.
                         */
                        attrs.$observe(type, function (val) {
                            $scope.ttContent = val;
                        });
                        attrs.$observe(prefix + 'Placement', function (val) {
                            $scope.ttPlacement = angular.isDefined(val) ? val : options.placement;
                        });

                        attrs.$observe(prefix + 'Trigger', function (val) {

                            element.unbind(triggers.show);
                            element.unbind(triggers.hide);

                            triggers = setTriggers(val);

                            triggerBinding();
                        });

                        attrs.$observe(prefix + 'Title', function (val) {
                            $scope.ttTitle = val;
                        });
                        attrs.$observe(prefix + 'Remote', function (val) {
                            $scope.ttRemote = val;
                        });
                        attrs.$observe(prefix + 'Single', function (val) {
                            $scope.ttSingle = val === "true" || val === true;
                        });

                        /**
                         * Manage scope events
                         */
                        $scope.$on('$destroy', function onDestroyTooltip () {
                            tooltip.unbind('click', stopEvent);

                            element.unbind(triggers.show);
                            element.unbind(triggers.hide);

                            if ($scope.tooltipIsOpen === true) {
                                hide();
                            } else {
                                tooltip.remove();
                            }
                        });

                        $scope.$on('popover.show', function (evt, elm, all) {
                            if (elm !== element && ($scope.ttSingle === true || all) && $scope.tooltipIsOpen === true) {
                                hideTooltipBind();
                            }
                        });
                        $scope.$on('popover.clickbody', hideTooltipBind);


                        // fix angular 1.3

                        triggerBinding();

                        // fix angular 1.3 - end


                    }//end link
                };//end return directive factory
            };// end returnservice
        }];//en return $get
});

angular
    .module('ua.popover')
    .directive('simplepopoverPopup', function () {
        "use strict";
        return {
            restrict  : 'A',
            replace   : true,
            scope     : {
                popoverTooltipTitle     : '@',
                popoverTooltipContent   : '@',
                popoverTooltipPlacement : '@',
                popoverTooltipRemote    : '@',
                popoverTooltipId        : '@',
                popoverTooltipIsOpen    : '='
            },
            templateUrl : 'components/ovh-utils-angular/popover/simplepopover/simplepopover.html'
        };
    }).directive('simplepopover', ['popoverFactory', function (popover) {
        "use strict";
        return popover('simplepopover', 'click');
    }]);

angular.module('ua.popover').directive('simpletooltipPopup', function () {
    "use strict";
    return {
        restrict  : 'A',
        replace   : true,
        scope     : {
            tooltipContent   : '@popoverTooltipContent',
            tooltipPlacement : '@popoverTooltipPlacement',
            tooltipIsOpen    : '=popoverTooltipIsOpen'
        },
        template  : '<div class="tooltip {{tooltipPlacement}} fade" ng-class="{ in: tooltipIsOpen}">' +
        '<div class="tooltip-arrow"></div>' +
        '<div class="tooltip-inner">' +
        '<div data-ng-bind-html="tooltipContent"></div>'+
        '</div>' +
        '</div>'
    };
}).directive('simpletooltip', ['popoverFactory', function (popover) {
    "use strict";
    return popover('simpletooltip', 'mouseenter');
}]);

/**
 * @type directive
 * @name ovhDirectives:preserveScroll
 * @version 1.0.0
 * @description
 * Preserve element scroll position when route change
 * # Usage
 * Add attribute `data-preserve-scroll` on the scrollable element with an unique name
 * @example
 *<code:html>
 *<div data-ng-controller="MyCtrl">
 *  <div data-preserve-scroll="scrollUniqId" style="overflow: auto; max-height: 250px;">
 *    <a data-ng-repeat="item in items"
 *        data-ng-href="#/item/{{item.id}}"
 *        style="display: block;"
 *        data-ng-bind="item.name"></a>
 *  </div>
 *</div>
 *</code>
 *<code:js>
 *var MyCtrl = function ($scope) {
 *  $scope.items = [];
 *  for (var i = 0; i <= 50; i++) {
 *      $scope.items.push({
 *          id: i,
 *          name: 'item ' + i
 *      });
 *  }
 *};
 *MyCtrl.$inject = ['$scope'];
 *</code>
 **/
angular.module('ua.preserveScroll').directive('preserveScroll',
['PreserveScrollCache',
    function (cache) {
        'use strict';
        return {
            'restrict': 'A',
            'scope': false,
            'link': function (scope, elt, attrs) {

                function restoreScrollWhenPhaseReady () {
                    if (scope.$$phase) {
                        setTimeout(function () {
                            restoreScrollWhenPhaseReady();
                        }, 25);
                    } else {
                        $(elt).scrollTop(cache.get(attrs.preserveScroll));
                    }
                }

                scope.$on('$routeChangeStart', function () {
                    cache.put(attrs.preserveScroll, $(elt).scrollTop());
                });
                scope.$on('$routeChangeSuccess', function () {
                    restoreScrollWhenPhaseReady();
                });
            }
        };
    }
]);

angular.module('ua.preserveScroll').factory('PreserveScrollCache', function ($cacheFactory) {
    'use strict';
    return $cacheFactory('preserveScrollCache');
});

angular.module('ua.price').filter('price',
['$translate',
function ($translate) {
    "use strict";

    var frenchTouch = {
        TTCOnly : false,
        HTOnly  : false,
        withTTC : true
    };

    var usTouch = {
        TTCOnly : false,
        HTOnly  : true,
        withTTC : false
    };

    var deutchTouch = {
        TTCOnly : true,
        HTOnly  : false,
        withTTC : true
    };

    var showTaxes = {
        CA : usTouch,
        WE : usTouch,
        WS : usTouch,
        QC : usTouch,
        DE : deutchTouch,
        FI : deutchTouch,
        SN : deutchTouch,
        CZ : frenchTouch,
        ES : frenchTouch,
        FR : frenchTouch,
        GB : frenchTouch,
        IE : frenchTouch,
        IT : frenchTouch,
        LT : frenchTouch,
        MA : frenchTouch,
        NL : frenchTouch,
        PL : frenchTouch,
        PT : frenchTouch,
        TN : frenchTouch
    };

    function format(price, country, frequency) {
        country = country || 'FR';

        var taxes = showTaxes[country];
        if (price.withTax.value !== 0) {
            if (taxes.TTCOnly) {
                return "<b class=\"red\">" + price.withTax.text + "</b>";
            } else {
                if (taxes.HTOnly) {
                    return "<b class=\"red\">" + price.withoutTax.text + "</b>";
                }
                if (frequency === 'yearly') {
                    return "<b class=\"red\">" + $translate.instant('price_ht_label', { price: price.withoutTax.text }) + "<small>" + $translate.instant('price_label_yearly') +
                           "</small></b><i class=\"small\"> (" + $translate.instant('price_ttc_label', { price: price.withTax.text }) + "<small>" + $translate.instant('price_label_yearly') + "</small>)</i>";
                }
                return "<b class=\"red\">" + $translate.instant('price_ht_label', { price: price.withoutTax.text }) +
                       "</b><i class=\"small\"> (" + $translate.instant('price_ttc_label', { price: price.withTax.text }) + ")</i>";
            }
        }
        return '<b class=\"red\">' +  $translate.instant('price_free') + '</b>';
    }

    return function (price, ovhSubsidiary, frequency) {
        if (price !== undefined ) {
            return format(price, ovhSubsidiary, frequency);
        }

        return "<span/>";
    };
}]);

/**
 * @type service
 * @name ovhServices:SessionFetcher
 * @description
 * fetch the session
 * @example
 * # Usage
 * <code:js>
 * angular.module('app').run(['SessionFetcher', function (SessionFetcher) {
 *      'use strict';
 *      //fetch '/auth/fetch' every 15 minutes
 *      SessionFetcher.init(null, null, true);
 * }]);
 * </code>
 */
angular.module('ua.sessionFetcher').service('SessionFetcher', ['$http', 'constants', function ($http, constants) {
    "use strict";
    var url, elapse,
        to = null,
        isFetching = false,
        stopFetching = false,
        self = this;
    /*
     * @type function
     * @name ovhServices:SessionFetcher.init
     * @description
     * the service initialisation
     * @param {string} nUrl api url
     * @param {int} nElapse time beetween each fetch
     * @param {boolean} autoStart auto start fetching
     */
    this.init = function (nUrl, nElpase, autoStart) {

        url = nUrl ? nUrl : constants.swsRootPath + 'auth/fetch';
        elapse = nElpase ? nElpase : 1500000;

        if (autoStart) {
            this.run();
        }
    };

    this.fetch = function (withAutoRun) {

        to = window.clearTimeout(to);

        if (!self.isFetching()) {

            isFetching = true;

            $http.get(url).then(function () {

                if (!self.isStoping() || withAutoRun) {
                    self.run();
                } else if (stopFetching) {
                    stopFetching = false;
                }

                isFetching = false;
            });
        }
    };

    this.run = function () {
        to = window.setTimeout(function () {
            self.fetch(true);
        }, elapse);
    };

    this.stopFetching = function () {
        stopFetching = true;
        to = window.clearTimeout(to);
    };

    this.isStoping = function () {
        return stopFetching;
    };

    this.isFetching = function () {
        return isFetching && !stopFetching;
    };

    this.setDelay = function (delay, autoStart) {
        this.stopFetching();
        this.run(url, delay, autoStart);
    };

}]);

angular.module('ua.sessionTimeout').factory('sessiontimeout', function () {
    'use strict';

    var timeoutDelayInMinutes = 60,
        remaining = timeoutDelayInMinutes,
        remainingDelayForConfirmation = 10,
        timer = false,
        fetchInProgress = false,
        confirmationDelayReachedCallback = false,
        sessionEndedCallback = false,
        sessionExpirationDelayChangeCallback = false;

    this.fetch = function () {

        if (!fetchInProgress) {
            fetchInProgress = true;

            // TODO
        }
    };

    this.reset = function () {
        this.stop();
        remaining = timeoutDelayInMinutes;
        this.init();
    };

    this.stop = function () {
        clearInterval(timer);
        timer = false;
    };

    this.init = function () {
        if (!timer) {
            timer = setInterval(function () {

                remaining--;

                if (remaining === remainingDelayForConfirmation) {
                    if (sessionExpirationDelayChangeCallback) {
                        sessionExpirationDelayChangeCallback(remaining);
                    }

                    if (confirmationDelayReachedCallback) {
                        confirmationDelayReachedCallback();
                    }
                } else if (remaining === 0) {
                    clearInterval(timer);

                    if (sessionEndedCallback) {
                        sessionEndedCallback();
                    }
                } else if (remaining < remainingDelayForConfirmation && sessionExpirationDelayChangeCallback) {
                    sessionExpirationDelayChangeCallback(remaining);
                }
            }, 60000); // every minute
        }
    };

    this.getRemainingExpirationDelay = function () {
        return remaining;
    };

    this.onConfirmationDelayReached = function (callback) {
        if (callback && $.isFunction(callback)) {
            confirmationDelayReachedCallback = callback;
        }
    };

    this.onSessionEnded = function (callback) {
        if (callback && $.isFunction(callback)) {
            sessionEndedCallback = callback;
        }
    };

    this.onSessionExpirationDelayChange = function (callback) {
        if (callback && $.isFunction(callback)) {
            sessionExpirationDelayChangeCallback = callback;
        }
    };

    return this;
});

angular.module('ua.stargate').controller('stargateCtrl',
['$scope', '$http', 'utils-angular.conf.STARGATE_URL',
function ($scope, $http, STARGATE_URL) {
    'use strict';

    var apiCommonUnivers = STARGATE_URL || 'api/common/univers';

    $scope.gates = null;
    $scope.loading = true;

    $http.get(apiCommonUnivers).then(function (success) {
        $scope.loading = false;
        var univers = success.results;
        if (angular.isObject(success.results)) {
            for (var i = 0 ; i < univers.length ; i++) {
                if (univers[i].name !== "univers-cloud") {
                    univers[i].targetEndpoint = univers[i].targetEndpoint.replace('login.html', 'index.html');
                }
            }
            $scope.gates = angular.copy(univers);
        } else {
            throw '[ovh-utils-angular] ovhDirectives.stargateCtrl : request result are not recognized ';
        }

    })["catch"](function () {
        $scope.loading = false;
    });

}]);

/**
 * @ngdoc directive
 * @name ovhDirectives.directive:stargate
 * @element ANY
 *
 * @decription
 * Navigate, like Stargate, in Universes! Provide a navigation menu, given by WS.
 *
 * @version 1.0.0
 *
 * @example
 * <code:html>
 *
 *     <ul data-stargate data-ng-show="gates" class="nav"></ul>
 *
 * </code>
 */
angular.module('ua.stargate').directive('stargate', function () {
    'use strict';
    return {
        restrict   : 'A',
        replace    : false,
        controller : 'stargateCtrl',
        templateUrl: 'components/ovh-utils-angular/stargate/stargate.html'
    };
});

/**
 * @type service
 * @name ovhServices:step
 * @description
 * Add step managment on html view.
 * # Usage
 * Add `step` service on view controller and call `inject` method to add fonctionality to the given scope.
 * @example
 * Html view :
 *<code:html>
 *<div data-ng-controller="MyController">
 *   <div data-ng-show="step.isStep(1)">
 *      <!-- step 1 -->
 *      ...
 *      <button type="button" data-ng-click="step.nextStep()">Next</button>
 *   </div>
 *   <div data-ng-show="step.isStep(2)">
 *      <!-- step 2 -->
 *      ...
 *      <button type="button" data-ng-click="step.previousStep()">Back</button>
 *      <button type="button" data-ng-click="step.nextStep()">Next</button>
 *   </div>
 *   <div data-ng-show="step.isStep(3)">
 *      <!-- step 3 -->
 *      ...
 *      <button type="button" data-ng-click="step.previousStep()">Back</button>
 *   </div>
 *</div>
 *</code>
 * Javascript view controller :
 *<code:js>
 *var MyController = function(scope, translate, step) {
 *   step.inject(scope);
 *   step.onChange(function(event) {
 *      switch(event.current) {
 *         case 2:
 *            // TODO
 *            break;
 *
 *         case 3:
 *            // TODO
 *            break;
 *
 *         default:
 *            // TODO
 *      }
 *   });
 *};
 *MyController.$inject = ['$scope', '$translate', 'step'];
 *</code>
 */
angular.module('ua.step').factory('step', function () {
    'use strict';

    var stepObj = {};

    stepObj.currentStep = 1;

    stepObj.onChangeCallback = [];

    stepObj.isStep = function (step) {
        return this.currentStep === step;
    };

    /**
    * @type function
    * @name ovhServices:step.setStep
    * @description
    * Change step to the given number
    * @param {integer} step step number
    */
    stepObj.setStep = function (step) {
        var evt = null, evtIdx;

        if (this.step !== step) {
            evt = {
                'previous': this.currentStep,
                'current': step
            };

            evtIdx = 0;
            this.currentStep = step;
            if (this.onChangeCallback.length > 0) {
                for (evtIdx = 0 ; evtIdx < this.onChangeCallback.length ; evtIdx++) {
                    this.onChangeCallback[evtIdx](evt);
                }
            }
        }
    };

    /**
    * @type function
    * @name ovhServices:step.hasPreviousStep
    * @description
    * Check if has a previous step
    * @return {boolean} true if has a previous step
    */
    stepObj.hasPreviousStep = function () {
        return this.currentStep > 1;
    };

    /**
    * @type function
    * @name ovhServices:step.onChange
    * @description
    * Listener called on step change with event object : `{current: current_step_number, previous: previous_step_number}`
    * @param {function} callback callback function
    */
    stepObj.onChange = function (callback) {
        if (angular.isFunction(callback)) {
            this.onChangeCallback.push(callback);
        }
    };

    /**
    * @type function
    * @name ovhServices:step.nextStep
    * @description
    * Change step to next
    */
    stepObj.nextStep = function () {
        this.setStep(stepObj.currentStep + 1);
    };
    /**
    * @type function
    * @name ovhServices:step.previousStep
    * @description
    * Change step to previous
    */
    stepObj.previousStep = function () {
        this.setStep(stepObj.currentStep - 1);
    };
    /**
    * @type function
    * @name ovhServices:step.resetStep
    * @description
    * Change step to first
    */
    stepObj.resetStep = function () {
        this.setStep(1);
    };

   /**
    * @type function
    * @name ovhServices:step.inject
    * @description
    * Add step methods to the given scope
    * @param {scope} scope scope to add methods
    **/
    stepObj.inject = function (scope) {

        this.onChangeCallback = [];

        this.resetStep();

        scope.step = this;
    };

    return stepObj;
});

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

/**
 * @type filter
 * @name ovhFilters:substring
 * @description
 * Extracts the characters from a string, between two specified indices, and returns the new sub string.
 * # Usage
 *<code:html>
 *{{text | substring:from:to}}
 *</code>
 * # Parameters
 * - {string} `text` - Source text
 * - {integer} `from` - The index where to start the extraction. First character is at index 0
 * - {integer} `to` - The index where to stop the extraction.
 * # Return
 * {string} - A new sub-string of `text`.
 * @example
 * Html view :
 *<code:html>
 *<p data-ng-init="name='Philippe'">Hello {{name | substring:0:4}}!</p>
 *</code>
 * Result :
 *<result>
 *<p>Hello Phil!</p>
 *</result>
 */
angular.module('ua.substring').filter('substring', function () {
    "use strict";
    return function (text, from, to) {
        if (text !== undefined) {

            if (!angular.isNumber(from)) {
                from = 0;
            }

            if (!angular.isNumber(to)) {
                to = text.length;
            }

            return text.substring(from, to);
        }

        return "! TEXT IS UNDEFINED !";
    };
});

angular.module('ua.timePicker').directive('timePicker',
['$timeout',
function ($timeout) {
    'use strict';

    var TIME_REGEXP = '((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)';

    return {
        restrict    : 'A',
        require     : '?ngModel',
        link        : function (scope, element, attrs, controller) {
            var timeRegExp,
                component,
                timepicker;

            if(controller) {
                element.on('changeTime.timepicker', function() {
                    $timeout(function() {
                        controller.$setViewValue(element.val());
                    });
                });

                // Handle input time validity
                timeRegExp = new RegExp('^' + TIME_REGEXP + '$', ['i']);

                // viewValue -> $parsers -> modelValue
                controller.$parsers.unshift(function(viewValue) {
                    if (!viewValue || timeRegExp.test(viewValue)) {
                        controller.$setValidity('time', true);
                        return viewValue;
                    } else {
                        controller.$setValidity('time', false);
                        return;
                    }
                });

            }

            // Create timepicker
            element.attr('data-toggle', 'timepicker');
            element.parent().addClass('bootstrap-timepicker');
            element.timepicker({});
            timepicker = element.data('timepicker');

            // Support add-on
            component = element.siblings('[data-toggle="timepicker"]');
            if(component.length) {
                component.on('click', $.proxy(timepicker.showWidget, timepicker));
            }
        }
    };
}]);

/**
 * @ngdoc directive
 * @name ovhDirectives.directive:tooltipBox
 * @element ANY
 * @requires Bootstrap (2.3.0+) Popover
 *
 * @decription
 * Provide a directive for the Bootstrap Popover.
 *
 * @version 1.0.1
 *
 * @example
 * <code:html>
 *
 *  <div data-ng-controller="testCtrl">
 *
 *      <button type="button" class="btn"
 *          data-tooltip-box
 *
 *          <!-- (title/contentText OR contentTemplate) -->
 *          data-tb-title="'Hello'"                             <!-- Title can be "text", of type string (with quotes) -->
 *          data-tb-title="myPopoverTitle"                      <!-- ... or set by a variable -->
 *          data-tb-content-text="'Hello, my name is Kevin'"    <!-- Content can be "text", of type string (with quotes) -->
 *          data-tb-content-text="myPopoverContent"             <!-- ... or set by a variable -->
 *          data-tb-content-template="views/toto/popover.html"  <!-- Otherwise, content can be a template file -->
 *
 *          data-tb-unique="true"                               <!-- Hide any active popover except self -->
 *          data-tb-placement="bottom"
 *          data-tb-container="selector"                        <!-- (default: body) Appends the popover to a specific element -->
 *          data-tb-hide-on-blur="true"                         <!-- (default: false) Hide popover when click outside -->
 *          data-*="All other bootstrap popover options">
 *              Click me!
 *      </button>
 *
 *  </div>
 *
 * </code>
 */
angular.module('ua.tooltipBox').directive('tooltipBox',
['ovhDirectives.constant.tooltipBox.CONFIG_OPTIONS', '$compile', '$http', '$rootScope', '$window', '$parse',
function (config, $compile, $http, $rootScope, $window, $parse) {
    'use strict';

    /**
     * @doc method
     * @methodOf ovhDirectives.directive:tooltipBox
     * @name ovhDirectives.directive:tooltipBox#getPosition
     * @param {node} element The DOM element.
     * @returns {object} Position of the element
     *
     * @description
     * Return the position of an element.
     */
    function getPosition(element) {
        var el = element[0];

        return $.extend({}, angular.isFunction(el.getBoundingClientRect) ? el.getBoundingClientRect() : {
            width   : el.offsetWidth,
            height  : el.offsetHeight
        }, element.offset());
    }

    return {
        restrict : 'A',
        replace: false,
        link : function ($scope, el, attrs) {

            var options = {},
                popover;

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:tooltipBox
             * @name ovhDirectives.directive:tooltipBox#setOptions
             *
             * @description
             * Sets the directive's options, using the datas of the element.
             */
            function setOptions() {
                var prefixedKey = '';
                angular.forEach(config, function(key) {
                    prefixedKey = 'tb' + (key.charAt(0).toUpperCase() + key.slice(1));
                    if(angular.isDefined(attrs[prefixedKey])) {
                        switch (key) {
                        case 'title':
                            options.title = $parse(attrs[prefixedKey])($scope);       // Can be a string (so, put simple quotes) or a var
                            break;
                        case 'contentText':
                            options.content = $parse(attrs[prefixedKey])($scope);     // Can be a string (so, put simple quotes) or a var
                            break;
                        case 'animation':
                        case 'html':
                        case 'unique':
                        case 'hideOnBlur':
                            options[key] = $parse(attrs[prefixedKey])($scope);    // Boolean values
                            break;
                        default:
                            options[key] = attrs[prefixedKey];
                        }
                    }
                });
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:tooltipBox
             * @name ovhDirectives.directive:tooltipBox#init
             *
             * @description
             * Initialize the directive.
             */
            function init() {

                el.popover(angular.extend(options, {
                    html: true
                }));

                popover = el.data('popover') ? el.data('popover') : el.data('bs.popover');
                defineBehaviors();

                $rootScope.$broadcast('ovhDirectives.tooltipBox.init');
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:tooltipBox
             * @name ovhDirectives.directive:tooltipBox#destroy
             *
             * @description
             * Destroy the directive.
             */
            function destroy() {
                if(popover && popover.$tip && popover.$tip.is(':visible')) {
                    popover.$tip.remove();
                    el.data('popover', null);
                    el.data('bs.popover', null);
                }
                $('body').off('keyup', hideOnEsc);
                if (options.hideOnBlur) {
                    $('body').off('click', hideOnBlur);
                }
                angular.element($window).unbind('resize', windowResize);
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:tooltipBox
             * @name ovhDirectives.directive:tooltipBox#hideOnEsc
             *
             * @description
             * Hide the popover when pressing escape touch.
             */
            function hideOnEsc(e) {
                if (e.keyCode === 27 && popover.$tip && popover.$tip.is(':visible')) {
                    el.popover('hide');
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:tooltipBox
             * @name ovhDirectives.directive:tooltipBox#hideOnBlur
             *
             * @description
             * Hide the popover when clicking outside.
             */
            function hideOnBlur(e) {
                if (popover.$tip && popover.$tip.is(':visible') && !el.is(e.target) && popover.$tip.has(e.target).length === 0) {
                    el.popover('hide');
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:tooltipBox
             * @name ovhDirectives.directive:tooltipBox#windowResize
             *
             * @description
             * Adjust the position on window resize.
             */
            function windowResize() {
                if (popover.$tip && popover.$tip.is(':visible')) {
                    var to = $window.setTimeout(function () {
                        managePlacement();
                        $window.clearTimeout(to);
                    }, 50);
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:tooltipBox
             * @name ovhDirectives.directive:tooltipBox#managePlacement
             *
             * @description
             * Manage the placement of the popover.
             */
            function managePlacement() {
                var $tip = $(popover.$tip),
                    tipWidth = $tip.outerWidth(),
                    tipHeight = $tip.outerHeight(),
                    elPos = getPosition(el),
                    windowWidth = $(window).width(),
                    placement = options.placement;

                $tip.addClass('tooltipBox-tip').addClass(placement);

                // @todo Update code to have all cases + responsive.

                switch (placement) {
                case 'bottom':
                    // If the datetimepicker overflow, pull it right.
                    if (windowWidth < elPos.left + tipWidth) {
                        $tip.css({
                            top: elPos.top + elPos.height + 10,
                            left: 'auto',
                            right: windowWidth - elPos.left - el[0].offsetWidth
                        });
                        $tip.addClass('pull-right');
                    } else {
                        $tip.css({
                            top: elPos.top + elPos.height + 10,
                            left: elPos.left + elPos.width / 2 - tipWidth / 2,
                            right: 'auto'
                        });
                        $tip.removeClass('pull-right');
                    }
                    break;
                case 'top':
                    $tip.css({
                        top : elPos.top - tipHeight,
                        left: elPos.left + elPos.width / 2 - tipWidth / 2
                    });
                    break;
                case 'left':
                    $tip.css({
                        top : elPos.top + elPos.height / 2 - tipHeight / 2,
                        left: elPos.left - tipWidth
                    });
                    break;
                case 'right':
                    $tip.css({
                        top : elPos.top + elPos.height / 2 - tipHeight / 2,
                        left: elPos.left + elPos.width
                    });
                    break;
                case 'rightTop':
                    $tip.css({
                        top : elPos.top + elPos.height / 2 - (tipHeight * 0.25),
                        left: elPos.left + elPos.width
                    });
                    break;
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:tooltipBox
             * @name ovhDirectives.directive:tooltipBox#defineBehaviors
             *
             * @description
             * Define directive's behaviors.
             */
            function defineBehaviors() {

                // Override Bootstrap's popover function to $compile
                popover.hasContent = function() {
                    return this.getTitle() || options.content; // fix multiple $compile()
                };
                popover.getPosition = function() {
                    var r = $.fn.popover.Constructor.prototype.getPosition.apply(popover, arguments);

                    // @todo managePlacement here!

                    $compile(popover.$tip)($scope);
                    $scope.$digest();

                    popover.$tip.data('popover', popover);     // Bind a ref to the box

                    return r;
                };

                el.on('show', function() {

                    setTimeout(function() {
                        managePlacement();
                    }, 50);

                    // If enabled, hide any active popover except self
                    if (options.unique) {
                        $('.popover.in').each(function() {
                            var $this = $(this),
                                currentPopover = $this.data('popover');
                            if(currentPopover && !currentPopover.$element.is(el)) {
                                $this.popover('hide');
                            }
                        });
                    }
                });

                // Hide the popover when pressing escape.
                $('body').on('keyup', hideOnEsc);

                // Hide the popover when clicking outside.
                if (options.hideOnBlur) {
                    $('body').on('click', hideOnBlur);
                }

                // Adjust the position on window resize.
                angular.element($window).bind('resize', windowResize);

                // Garbage collection.
                $scope.$on('$destroy', destroy);
            }

            $scope.show = function() {
                el.popover('show');
            };

            $scope.hide = function() {
                el.popover('hide');
            };

            $scope.$on('tooltipBox-hide', function () {
                el.popover('hide');
            });


            /*==========  Init  ==========*/

            setOptions();

            if (options.content) {
                init();
            } else {

                // Content is a template.
                $http.get(options.contentTemplate).then(function (template) {
                    options.content = template.data;

                    init();

                })["catch"](function () {
                    throw 'Error template tooltip';
                });
            }

        }
    };
}]);

/**
 * @type service
 * @name ovhServices:translator
 * @see [url=#/module=ovhDirectives&directive=i18n]i18n[/url] directive
 * @version 3.0.0
 * @description
 * Manage translations.
 * # Require
 * - AngularJS [url=http://docs.angularjs.org/api/ngCookies]ngCookies[/url]
 * # Translation files
 * Translations are stored in json files and are splitted in separate modules files.
 * [b]"core"[/b] module is the main interface translation json file. Use it to store interface and common use modules translations.
 * # Path
 * resources/i18n/<module>/Messages_<language>.json
 * # Basic syntaxe
 * a_key = A value.
 * # Syntaxe with variables
 * another_key = A text with 2 vars : {0} and {1}.
 * another_key[b]_default[/b] = A default text if no vars given or null, ...
 * # Pluralize syntaxe
 * a_key[b]_0[/b] : (optional) if not specified, 0 would be matched to the "_other" category
 * a_key[b]_one[/b] : match count equal to 1
 * a_key[b]_other[/b] : match any count that is not 1
 * You can use a set of closed braces([b]{}[/b]) as a placeholder in the text value for the counter. (see example below)
 * # Usage
 * Add service `translator` to controller view and call `load` method to load desired modules translations.
 * [b][u]HTML view:[/b][/u][br]This will add a map `i18n` directly on the [url=http://docs.angularjs.org/api/ng.$rootScope]`$rootScope`[/url] with all translations as "key:value", a `tr` method to transform text with given variables and a `trpl` method to transform and pluralize text with given variables.
 * @example
 * Properties file :
 *<code>
 *translation_key_in_properties_file = Text here.
 *text_with_var = Hello {0} !
 *text_world = world
 *
 *# pluralize keys
 *test_person_count_0 = Nobody is viewing.
 *test_person_count_one = 1 person is viewing.
 *test_person_count_500 = Wow !!! 500 persons are watching me !
 *test_person_count_other = {} people are viewing.
 *</code>
 * Javascript view controller :
 *<code:js>
 *var MyController = function(scope, translator) {
 *   translator.load(['core', 'module_x', 'module_xx']);
 *   ...
 *   var value = translator.tr('translation_key_in_properties_file');
 *};
 *MyController.$inject = ['$scope', 'translator'];
 *</code>
 * Html view :
 *<code:html>
 *Test translation with variables :
 *<ul>
 *   <li>translation_key_in_properties_file : {{i18n.translation_key_in_properties_file}}</li>
 *   <li>{{i18n.text_with_var}}</li>
 *   <li>{{tr('text_with_var')}}</li>
 *   <li>{{tr('text_with_var', ['John'])}}</li>
 *   <li>{{tr('text_with_var', [i18n.text_world])}}</li>
 *   <li>{{i18n.unknown_text}}</li>
 *   <li>{{tr('unknown_text')}}</li>
 *</ul>
 *Test pluralize translation :
 *<ul>
 *   <li>{{i18n.test_person_count}}</li>
 *   <li>{{i18n.test_person_count_0}}</li>
 *   <li>{{i18n.test_person_count_one}}</li>
 *   <li>{{i18n.test_person_count_other}}</li>
 *   <li>{{tr('test_person_count')}}</li>
 *   <li>{{trpl('test_person_count')}}</li>
 *   <li>{{trpl('test_person_count', 0)}}</li>
 *   <li>{{trpl('test_person_count', 1)}}</li>
 *   <li>{{trpl('test_person_count', 10)}}</li>
 *   <li>{{trpl('test_person_count', 499)}}</li>
 *   <li>{{trpl('test_person_count', 500)}}</li>
 *</ul>
 *</code>
 * Result :
 *<result>
 *Test translation with variables :
 *<ul>
 *   <li>translation_key_in_properties_file : Text here.</li>
 *   <li>Hello {0} !</li>
 *   <li>Hello {0} !</li>
 *   <li>Hello John !</li>
 *   <li>Hello world !</li>
 *   <li></li>
 *   <li>/!\ unknown_text</li>
 *</ul>
 *Test pluralize translation :
 *<ul>
 *   <li></li>
 *   <li>Nobody is viewing.</li>
 *   <li>1 person is viewing.</li>
 *   <li>{} people are viewing.</li>
 *   <li>/!\ test_person_count</li>
 *   <li>/!\ test_person_count</li>
 *   <li>Nobody is viewing.</li>
 *   <li>1 person is viewing.</li>
 *   <li>10 people are viewing.</li>
 *   <li>499 people are viewing</li>
 *   <li>Wow !!! 500 persons are watching me !</li>
 *</ul>
 *</result>
 */
angular.module('ua.translator').provider('translator', function() {
    'use strict';
    var availableLanguages;

    this.setAvailableLanguages = function (langs) {
        availableLanguages = langs;
    };

    this.$get = ['$rootScope', '$http', 'AVAILABLE_LANGUAGE', 'storage', '$q', 'tmhDynamicLocale', function ($rootScope, $http, AVAILABLE_LANGUAGE, localStorage, $q, tmhDynamicLocale) {
        var csidRegExp = new RegExp(/(.+\.html).*(\?|&)csid=([A-Za-z0-9]*).*/),
            langRegExp = /lang=([a-z]{2}_[A-Z]{2})/,
            safeApply = function (fn) {
                var phase = $rootScope.$$phase;
                if (phase === '$apply' || phase === '$digest') {
                    if (fn && typeof fn === 'function') {
                        fn();
                    }
                } else {
                    $rootScope.$apply(fn);
                }
            },
            _availableLanguages = availableLanguages || AVAILABLE_LANGUAGE,
            _basePath = '',
            _resourcesPath = 'resources/i18n/',
            _browserLanguage = navigator.language || navigator.userLanguage,
            _defaultLanguage = "en_GB",
            _cache = {},
            _currentLanguage = false,
            _allModules = [],
            _translator = {
                /**
                 * @type function
                 * @name ovhServices:translator.setBasePath
                 * @description
                 * Change ressource path - must end with '/'
                 * @param {string} the base Path
                 **/
                'setBasePath': function (basePath) {
                    if (!!basePath) {
                        _basePath = basePath;
                    } else {
                        _basePath = '';
                    }
                },
                /**
                 * @type function
                 * @name ovhServices:translator.setResourcesPath
                 * @description
                 * Change ressource path - must end with '/'
                 * @param {string} the base Path
                 **/
                'setResourcesPath' : function (rp) {
                    if (!!rp) {
                        _resourcesPath = rp;
                    } else {
                        _resourcesPath = 'resources/i18n/';
                    }
                },
                /**
                 * @type function
                 * @name ovhServices:translator.setTitle
                 * @description
                 * Change document title
                 * @param {string} the new title
                 */
                'setTitle': function (title) {

                    document.title = title;
                },
                /**
                 * @type function
                 * @name ovhServices:translator.getDefaultLanguage
                 * @description
                 * Default application language code
                 * @return {string} language code value
                 */
                'getDefaultLanguage': function () {

                    return _defaultLanguage;
                },
                /**
                 * @type function
                 * @name ovhServices:translator.getBrowserLanguage
                 * @description
                 * Current browser language code
                 * @return {string} language code value
                 */
                'getBrowserLanguage': function () {

                    var formattedLanguage = _browserLanguage.replace('-', '_'),
                        country = formattedLanguage.split('_')[0],
                        local;

                    if (formattedLanguage.indexOf('_') === -1 && country) {
                        angular.forEach(_availableLanguages, function (v) {
                            if ([country.toLowerCase(),country.toUpperCase()].join('_') === v.value) {
                                local = v.value;
                            }
                        });
                    } else {
                        angular.forEach(_availableLanguages, function (v) {
                            if (/^(.*)_.*$/.test(v.value) && country === v.value.match(/^(.*)_.*$/)[1]) {
                                local = v.value;
                            }
                        });
                    }

                    return local;
                },
                /**
                 * @type function
                 * @name ovhServices:translator.getAvailableLanguages
                 * @description
                 * Available languages list
                 * @return {array} object list
                 */
                'getAvailableLanguages': function () {

                    return _availableLanguages;
                },

                'setAvailableLanguages': function (langs) {

                    _availableLanguages = langs;
                    _translator.setLanguage(_translator.getLanguage());
                },

                /**
                 * @type function
                 * @name ovhServices:translator.isAvailableLanguage
                 * @description
                 * Check language code value availability
                 * @param {string} lang language code value
                 * @return {boolean} true if given language is an available languages
                 */
                'isAvailableLanguage': function (lang) {

                    var found = false;
                    if (lang && lang.match(/^[a-z]{2}[\-_]{1}[A-Z]{2}$/)) {
                        angular.forEach(_availableLanguages, function (v) {
                            if (v.value === lang) {
                                found = true;
                            }
                        });
                    }
                    return found;
                },
                /**
                 * @type function
                 * @name ovhServices:translator.getLanguage
                 * @description
                 * Current use language
                 * @return {string} language code value
                 */
                'getLanguage': function () {
                    if (_currentLanguage === false) {

                        var csid = window.location.href.match(csidRegExp) ? window.location.href.replace(csidRegExp, '$3') : null,
                            langUrl = window.location.search.match(langRegExp);

                        if (langUrl && _translator.isAvailableLanguage(langUrl[1])) {
                            return langUrl[1];
                        }
                        else if (csid !== null && localStorage.get('univers-selected-language-' + csid, true) && _translator.isAvailableLanguage(localStorage.get('univers-selected-language-' + csid))) {
                            return localStorage.get('univers-selected-language-' + csid, true);
                        } else if (localStorage.get('univers-selected-language') && _translator.isAvailableLanguage(localStorage.get('univers-selected-language'))) {
                            return localStorage.get('univers-selected-language');
                        } else if (_translator.isAvailableLanguage(_translator.getBrowserLanguage())) {
                            return _translator.getBrowserLanguage();
                        } else {
                            return _defaultLanguage;
                        }
                    }
                    return _currentLanguage;
                },
                /**
                 * @type function
                 * @name ovhServices:translator.getSelectedAvailableLanguage
                 * @description
                 * Current available language object
                 * @return {object} available object language
                 */
                'getSelectedAvailableLanguage': function () {


                    var local = null;
                    angular.forEach(_availableLanguages, function (v) {
                        if (v.value === _translator.getLanguage()) {
                            local = v;
                        }
                    });
                    return local;
                },
                /**
                 * @type function
                 * @name ovhServices:translator.setLanguage
                 * @description
                 * Set application language
                 * @param {string} lang language code value
                 * @param {array|string} module module name or modules name list
                 */
                'setLanguage': function (lang) {


                    if ((_currentLanguage === false || _currentLanguage !== lang) && _translator.isAvailableLanguage(lang)) {

                        _currentLanguage = lang;

                        var csid = window.location.href.match(csidRegExp) ? window.location.href.replace(csidRegExp, '$3') : null, htmlLang;

                        // update html lang
                        angular.forEach(_availableLanguages, function (v) {
                            if (v.value === lang && /^(.*)_.*$/.test(v.value)) {
                                htmlLang = v.value.match(/^(.*)_.*$/)[1];
                            }
                        });

                        if (htmlLang) {
                            angular.element('html').attr('lang', htmlLang);
                        }

                        angular.forEach(_allModules, function (module) {
                            _translator.load(module);
                        });

                        // cookies language
                        localStorage.add('univers-selected-language', lang);

                        // Syncing $translator and $local languages
                        tmhDynamicLocale.set(lang.replace('_', '-').toLowerCase());

                        if (csid !== null) {
                            localStorage.add('univers-selected-language-' + csid, lang, true);
                        }
                    }
                },
                /**
                 * @type function
                 * @name ovhServices:translator.tr
                 * @description
                 * Scope translation method
                 * @param {string} key properties file key
                 * @param {array} vars variables string array
                 * @param {boolean|string} bbcode boolean or string true|false to enable bbcode support
                 */
                'tr': function (key, vars, bbcode) {


                    if ($rootScope.i18n[key]) {
                        var txt = $rootScope.i18n[key];

                        if (angular.isArray(vars)) {
                            if (vars.length > 0) {
                                angular.forEach(vars, function (value, index) {
                                    txt = txt.replace(new RegExp('\\{' + index + '\\}', "g"), (value === undefined || value === null ? '' : value));
                                });
                            } else if ($rootScope.i18n[key + '_default']) {
                                txt = $rootScope.i18n[key + '_default'];
                            }
                        } else if (angular.isString(vars)) {
                            txt = txt.replace(new RegExp('\\{0\\}', "g"), vars);
                        }

                        if (bbcode && (bbcode === true || bbcode === 'true')) {
                            txt = txt.replace(/\[b\](.*?)\[\/b\]/g, "<strong>$1</strong>");
                            txt = txt.replace(/\[i\](.*?)\[\/i\]/g, "<em>$1</em>");
                            txt = txt.replace(/\[u\](.*?)\[\/u\]/g, "<u>$1</u>");
                            txt = txt.replace(/\[class=(.*?)\](.*?)\[\/class\]/g, "<span class=\"$1\">$2</span>");
                            txt = txt.replace(/\[color=(.*?)\](.*?)\[\/color\]/g, "<span style=\"color:$1;\">$2</span>");
                            txt = txt.replace(/\[size=(.*?)\](.*?)\[\/size\]/g, "<span style=\"font-size:$1;\">$2</span>");
                            txt = txt.replace(/\[url\](.*?)\[\/url\]/g, "<a href=\"$1\">$1</a>");
                            txt = txt.replace(/\[url=(.*?)\](.*?)\[\/url\]/g, "<a href=\"$1\">$2</a>");
                            txt = txt.replace(/\[email\](.*?)\[\/email\]/g, "<a href=\"mailto:$1\">$1</a>");
                            txt = txt.replace(/\[email=(.*?)\](.*?)\[\/email\]/g, "<a href=\"mailto:$1\">$2</a>");
                            txt = txt.replace(/(\\n|\[br\])/g, "<br/>");
                        }
                        return txt;
                    }

                    if (key !== null && key !== undefined && key !== '') {
                        return $rootScope.i18n[key + '_default'] || '/!\\ ' + key;
                    } else {
                        return '';
                    }
                },
                /**
                 * @type function
                 * @name ovhServices:translator.trpl
                 * @description
                 * Scope pluralize translation method
                 * @param {string} key properties file key
                 * @param {integer} count number use to pluralize text
                 * @param {array} vars variables string array
                 * @param {boolean|string} bbcode boolean or string true|false to enable bbcode support
                 */
                'trpl': function (key, count, vars, bbcode) {


                    if (count && !isNaN(count)) {
                        count = parseInt(count, 10);
                        if (count === 0 && $rootScope.i18n[key + '_0']) {
                            return _translator.tr((key + '_0'), vars, bbcode);
                        } else if (count === 1 && $rootScope.i18n[key + '_one']) {
                            return _translator.tr((key + '_one'), vars, bbcode);
                        } else if ($rootScope.i18n[key + '_' + count]) {
                            return _translator.tr(key + '_' + count, vars, bbcode);
                        } else if ($rootScope.i18n[key + '_other']) {
                            return _translator.tr((key + '_other'), vars, bbcode).replace('{}', count);
                        }
                    }
                    return _translator.tr(key, vars, bbcode);
                },
                /**
                 * @type function
                 * @name ovhServices:translator.load
                 * @description
                 * Load desired modules translations (if needed)
                 * @param {array|string} module name or modules name list
                 * @param {string} baseUrl for thoses modules
                 */
                'load': function (modules, basePath, resourcesPath) {

                    var _modules, requestsTab = [],
                        newBP = basePath || _basePath,
                        newRP = resourcesPath || _resourcesPath;


                    if (angular.isArray(modules)) {
                        _modules = modules;
                    } else if (angular.isString(modules)) {
                        _modules = modules.split(/[\s,;|]/g);
                    } else {
                        throw '[translator][load] modules parameter must be an array or a string !';
                    }

                    if (!_cache[_currentLanguage]) {
                        _cache[_currentLanguage] = {};
                    }

                    angular.forEach(_modules, function (module) {
                        if (_allModules.indexOf(module) === -1) {
                            _allModules.push(module);
                        }

                        if (!_cache[_currentLanguage][module]) {
                            _cache[_currentLanguage][module] = {};
                            requestsTab.push($http.get([newBP, newRP, module, '/Messages_',  _currentLanguage,'.json'].join('')).then(function (json) {
                                _cache[_currentLanguage][module] = json.data;
                                safeApply(function () {
                                    angular.extend($rootScope.i18n, json.data);
                                });
                                return $rootScope.i18n;
                            }, function () {
                                return $http.get([newBP, newRP, module, '/Messages_en_GB.json'].join('')).then(function (json) {
                                    _cache[_currentLanguage][module] = json.data;
                                    safeApply(function () {
                                        angular.extend($rootScope.i18n, json.data);
                                    });
                                    return $rootScope.i18n;
                                }, function () {
                                    return $http.get([newBP, newRP, module, '/Messages_fr_FR.json'].join('')).then(function (json) {
                                        _cache[_currentLanguage][module] = json.data;
                                        safeApply(function () {
                                            angular.extend($rootScope.i18n, json.data);
                                        });
                                        return $rootScope.i18n;
                                    });
                                });
                            }));
                        } else {
                            requestsTab.push($q.when('start').then(function () {
                                safeApply(function () {
                                    angular.extend($rootScope.i18n, _cache[_currentLanguage][module]);
                                });
                                return $rootScope.i18n;
                            }));
                        }
                    });

                    return $q.all(requestsTab).then(function () {
                        return $rootScope.i18n;
                    });
                }
            };

        // Check if rootScope has i18n
        if ($rootScope.i18n === undefined) {
            $rootScope.i18n = {};
        }

        $rootScope.tr = _translator.tr;
        $rootScope.trpl = _translator.trpl;

        _translator.setLanguage(_translator.getLanguage());

        return _translator;
    }];
});

/**
 * @ngdoc directive
 * @name ovhDirectives.directive:triStateCheckbox
 * @element ANY
 *
 * @decription
 * The directive tracks the array of selected element and update automatically its state.
 *
 * State:
 *   - 0 : Nothing selected
 *   - 1 : Partial elements selected
 *   - 2 : All elements selected
 *
 * @version 1.0.1
 *
 * @example
 * <code:html>
 *
 *     <input type="checkbox"
 *            data-tri-state-checkbox="id"        <!-- (ID is optional) -->
 *            data-tsc-ids-all="arrayFull"        <!-- Array with all IDs -->
 *            data-tsc-ids-selected="arraySel"    <!-- Array with IDs selected -->
 *            data-tsc-on-click="foo(newState)"   <!-- Parent scope function called when user click on the checkbox -->
 *     />
 *
 * </code>
 *
 * @info
 * The checkbox update its state AUTOMATICALLY when the array of selected IDs is updated.
 * If the user click on the checkbox, it call a function with the new state in param.
 * With this, you can update your array/view!
 */
angular.module('ua.triStateCheckbox').directive('triStateCheckbox', ['$timeout', function ($timeout) {
    'use strict';
    return {
        restrict : 'A',
        scope    : {
            idsAll      : '=tscIdsAll',
            idsSelected : '=tscIdsSelected',
            onClick     : '&tscOnClick'
        },
        link     : function ($scope, el) {
            var initialized = false;

            $scope.state = 0;

            function init() {
                $scope.$watch('idsAll.length', function() {
                    autoUpdateState();
                });
                $scope.$watch('idsSelected.length', function() {
                    autoUpdateState();
                });
                initialized = true;
            }

            function autoUpdateState() {
                if ($scope.idsAll.length && $scope.idsAll.length === $scope.idsSelected.length) {
                    setStateTo(2);
                } else if ($scope.idsAll.length && $scope.idsSelected.length > 0) {
                    setStateTo(1);
                } else {
                    setStateTo(0);
                }
            }

            function setStateTo(nbr) {
                if (!initialized) {
                    return;
                }
                $scope.state = nbr;
                $timeout(function() {
                    el.prop({
                        'checked'       : (nbr === 2 ? true : false),
                        'indeterminate' : (nbr === 1 ? true : false)
                    });
                });
            }

            $scope.$watch('idsAll', function() {
                if (!initialized && angular.isArray($scope.idsAll) && $scope.idsAll.length) {
                    init();
                }
            });

            // @todo test touch
            el.bind('click touchend', function(e) {
                e.preventDefault();
                if ($scope.state === 2) {
                    setStateTo(0);
                } else {
                    setStateTo($scope.state + 1);
                }
                $scope.onClick({ state: $scope.state });
            });

        }
    };
}]);

angular.module('ua.typeOff').controller('typeOffCtrl',
['$scope', '$parse', '$attrs', '$filter',
function ($scope, $parse, attrs, $filter) {
    "use strict";

    var savedItems;

    $scope.hide = false;

    this.activate = function(item) {
        $scope.active = item;
    };

    this.activateNextItem = function() {
        var index = $scope.items.indexOf($scope.active);
        this.activate($scope.items[(index + 1) % $scope.items.length]);
    };

    this.activatePreviousItem = function() {
        var index = $scope.items.indexOf($scope.active);
        this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
    };

    this.isActive = function(item) {
        return $scope.active === item;
    };

    this.selectActive = function() {
        this.select($scope.active);
    };

    /*
     * Select item in list
     */
    this.select = function(item) {

        $scope.hide = true;
        $scope.focused = true;

        if (attrs.typeOffTermPath && angular.isString($scope.termpath)) {
            $scope.term = $parse($scope.termpath)(item);
        } else {
            if (attrs.typeOffSelect) {
                $scope.select({
                    item:item
                });
            } else {
                $scope.term = item;
            }
        }
    };

    this.hide = function () {
        $scope.hide = true;
        $scope.focused = true;
    };

    $scope.isVisible = function() {
        if ($scope.showWhenEmpty === true || $scope.showWhenEmpty === "true") {
            return !$scope.hide && ($scope.focused || $scope.mousedOver);
        } else {
            return !$scope.hide && ($scope.focused || $scope.mousedOver) && (angular.isString($scope.term) && $scope.term !== '');
        }
    };

    this.query = $scope.query = function () {
        $scope.hide = false;

        if (!attrs.typeOffTerm) {
            throw "[ovh-utils-angular.ovhDirects.typeOff.query] missing 'type-off-term attribute'";
        }

        if (attrs.typeOffSearch) {
            $scope.search({
                term    :   $scope.term
            });
        } else {
            if (angular.isUndefined(savedItems) && $scope.items && $scope.items.length > 0) {
                savedItems = angular.copy($scope.items);
            }

            if ($scope.term) {
                $scope.items = $filter('filter')(savedItems || [], $scope.term);
            } else {
                $scope.items = savedItems;
            }
        }
    };
}]);

/**
 * @ngdoc directive
 * @name ovhDirectives.directives:dateTimePicker
 * @element ANY
 * @requires
 *
 * @description
 * provide autocompletion
 *
 * @example
 * <code:html>
 *
 *
 *  <div data-ng-controller="TestSimple">
 *       <div data-type-off
 *            class="type-off"
 *            data-type-off-items="items"           <!-- list of item to search -->
 *            data-type-off-term="term"             <!-- the input model -->
 *            data-type-off-term-path="'name'">     <!-- the path to search term into item-->
 *
 *             <!-- this part is a template you can make what you want -->
 *             <div class="type-off-suggestions">
 *                <h3 data-ng-show="hasItems()">Items</h3>
 *                <ul>
 *                    <li data-type-off-item="item"     <!-- to bind event for selection -->
 *                        data-ng-repeat="item in items"
 *                        class="type-off-item">
 *                        <p>{{item.name}}</p>
 *                        <p>{{item.data}}</p>
 *                    </li>
 *                </ul>
 *            </div>
 *
 *         </div>
 *     </div>
 *
 *     <div data-ng-controller="TestComplete">
 *
 *        <div data-type-off
 *             class="type-off"
 *             data-type-off-items="items"
 *             data-type-off-term="term"
 *             data-type-off-search="searchItem(term)"    <!--- you can create your own search function-->
 *             data-type-off-select="selectItem(item)">   <!-- you can create your own selection function-->
 *
 *            <!-- you can create sub categorie for instance -->
 *            <div class="type-off-suggestions">
 *
 *                <h3 data-ng-show="hasItemsA()">A</h3>
 *                <ul>
 *                    <li data-type-off-item="itemA"
 *                        data-ng-repeat="itemA in fitemsA" class="type-off-item">
 *                        <p>{{itemA.name}}</p>
 *                        <p>{{itemA.data}}</p>
 *                    </li>
 *                </ul>
 *
 *                <h3 data-ng-show="hasItemsB()">B</h3>
 *                <ul>
 *                    <li data-type-off-item="itemB"
 *                        data-ng-repeat="itemB in fitemsB" class="type-off-item">
 *                        <p>{{itemB.name}}</p>
 *                    </li>
 *                </ul>
 *
 *            </div>
 *        </div>
 *    </div>
 *    <script type="text/javascript">
 *            angular.module('test', ['ovh-utils-angular']).controller('TestSimple', ['$scope', '$filter', function($scope, $filter) {
 *
 *                $scope.items  = [];
 *                $scope.term = null;
 *
 *                // juste get item
 *                for (var i = 0 ; i < 10 ; i++) {
 *                    $scope.items.push({
 *                        id   : 'A-' + i,
 *                        name : 'items a ' + i,
 *                        data : 'aaaaaaaaaa' + i + 'aaaaaaaa'
 *                    });
 *                    $scope.items.push({
 *                        id   : 'B-' + i,
 *                        name : 'items b ' + i,
 *                        data : 'bbbbbbbbbb' + i + 'bbbbbbbbb'
 *                    });
 *                }
 *
 *                $scope.hasItems = function() {
 *                    return $scope.items.length > 0;
 *                };
 *
 *            }]).controller('TestComplete', ['$scope', '$filter', function($scope, $filter) {
 *
 *                    $scope.items  = [];
 *                    $scope.term = null;
 *
 *                    var itemsA = [],
 *                        itemsB = [];
 *
 *                    for (var i = 0 ; i < 10 ; i++) {
 *                        itemsA.push({
 *                            id   : 'A-' + i,
 *                            name : 'items a ' + i,
 *                            data : 'aaaaaaaaaa' + i + 'aaaaaaaa'
 *                        });
 *
 *                        itemsB.push({
 *                            id   : 'B-' + i,
 *                            name : 'items b ' + i,
 *                            data : 'bbbbbbbbbb' + i + 'bbbbbbbbb'
 *                        });
 *
 *                     }
 *
 *                    // for custom search we hav to save item
 *                    $scope.fitemsB = itemsB;
 *                    $scope.fitemsA = itemsA;
 *
 *                    $scope.items = itemsA.concat(itemsB);
 *
 *                    // custome search function
 *                    $scope.searchItem = function (term) {
 *                        if (term) {
 *                            $scope.fitemsA = $filter('filter')(itemsA, {data : term});
 *                            $scope.fitemsB = $filter('filter')(itemsB, {data : term});
 *                        } else {
 *                            $scope.fitemsA = itemsA;
 *                            $scope.fitemsB = itemsB;
 *                        }
 *                    };
 *
 *                    // simple custom selection item
 *                    $scope.selectItem = function (item) {
 *                        console.log('item selected!', item);
 *                        $scope.term = item.name;
 *                    };
 *
 *                    $scope.hasItemsA = function() {
 *                        return $scope.fitemsA.length > 0;
 *                    };
 *
 *                    $scope.hasItemsB = function() {
 *                        return $scope.fitemsB.length > 0;
 *                    };
 *
 *            }]);;
 *        </script>
 *
 * </code>
 */
angular.module('ua.typeOff').directive('typeOff',
["$timeout",
function ($timeout) {
    "use strict";

    return {
        restrict    : 'A',
        transclude  : true,
        replace     : true,
        template    : '<div><form>' +
                '<input data-ng-class="inputClass" data-ng-model="term" data-ng-change="query()" type="text" autocomplete="off" /></form>' +
                '<div data-ng-transclude></div>' +
        '</div>',
        scope       : {
            search          : '&typeOffSearch',
            select          : '&typeOffSelect',
            items           : '=typeOffItems',
            term            : '=typeOffTerm',
            termpath        : '=typeOffTermPath',
            showWhenEmpty   : '=typeOffShowWhenEmpty',
            inputClass      : '=typeOffInputClass'
        },
        controller : 'typeOffCtrl',
        link: function (scope, element, attrs, controller) {
            var $input = element.find('form > input'),
                $list = element.find('> div');

            $input.bind('focus', function() {
                scope.$apply(function () {
                    scope.focused = true;
                });
            });

            $input.bind('blur', function() {
                scope.$apply(function() {
                    scope.focused = false;
                });
            });

            $list.bind('mouseover', function() {
                scope.$apply(function() {
                    scope.mousedOver = true;
                });
            });

            $list.bind('mouseleave', function() {
                scope.$apply(function() {
                    scope.mousedOver = false;
                });
            });

            $input.bind('keyup', function(e) {
                if (e.keyCode === 9 || e.keyCode === 13) {
                    scope.$apply(function() {
                        controller.selectActive();
                        controller.query();
                        controller.hide();
                    });
                }

                if (e.keyCode === 27) {
                    scope.$apply(function() {
                        scope.hide = true;
                    });
                }
            });

            $input.bind('keydown', function(e) {
                if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
                    e.preventDefault();
                }

                if (e.keyCode === 40) {

                    e.preventDefault();

                    scope.$apply(function() {
                        controller.activateNextItem();
                    });

                }

                if (e.keyCode === 38) {
                    e.preventDefault();
                    scope.$apply(function() {
                        controller.activatePreviousItem();
                    });
                }
            });

            scope.$watch('items', function (items) {
                controller.activate(items.length > 0 ? items[0] : null);
            });

            scope.$watch('focused', function(focused) {
                if (focused) {
                    $timeout(function() {
                        $input.focus();
                    }, 0, false);
                }
            });

            scope.$watch('isVisible()', function (visible) {
                var pos, height;

                if (visible) {
                    pos = $input.position();
                    height = $input[0].offsetHeight;

                    $list.css({
                        top      : pos.top + height,
                        left     : pos.left,
                        position : 'absolute',
                        display  : 'block'
                    });

                } else {
                    $list.css('display', 'none');
                }
            });
        }
    };
}]);

angular.module('ua.typeOff').directive('typeOffItem', function () {
    "use strict";
    return {
        require     : '^typeOff',
        restrict    : 'A',
        link        : function (scope, element, attrs, controller) {

            var item = scope.$eval(attrs.typeOffItem);

            scope.$watch(function() {
                return controller.isActive(item);
            }, function(active) {
                if (active) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });

            element.bind('mouseenter', function () {
                scope.$apply(function () {
                    controller.activate(item);
                });
            });

            element.bind('click', function () {
                scope.$apply(function() {
                    controller.select(item);
                    controller.query();
                    controller.activateNextItem();
                    controller.hide();
                });
            });
        }
    };
});

/*
* controller for wizard directives
*/
angular.module('ua.wizard').controller('wizardCtrl',
['$scope', '$translate',
function ($scope, $translate) {
    'use strict';

    $scope.currentStep = this.currentStep = 0;
    $scope.steps = this.steps = [];

    $scope.stepCount = 0;
    $scope.wizardTitle = '';
    $scope.wizardTitleIcon = '';
    $scope.confirmButton = true;
    $scope.cancelButton = true;
    $scope.keydownDisabled = false;
    $scope.wizardBreadCrumb = false;
    $scope.wizardConfirmButtonText = $translate.instant('wizard_confirm');
    $scope.wizardCancelButtonText = $translate.instant('wizard_cancel');
    $scope.wizardPreviousButtonText = $translate.instant('wizard_previous');
    $scope.wizardNextButtonText = $translate.instant('wizard_next');
    $scope.wizardCloseButton = true;
    $scope.wizardPreviousButton = true;

    $scope.onFinish = function () {};
    $scope.onCancel = function () {};

    var self = this;

    this.setStepCount = function (count) {
        $scope.stepCount = count;
        angular.forEach($scope.steps, function (step) {
            step.stepCount = $scope.stepCount;
        });
    };

    this.getStepCount = function () {
        return $scope.stepCount;
    };

    /*
     *Add step to the wizard
     */
    this.addStep = function (step) {
        this.steps.push(step);
    };

    /*
     *return the numbers of step
     */
    this.getStepCount = function () {
        return $scope.stepCount;
    };

    /*
     * got to the next step
     */
    this.nextStep = function () {
        $scope.$broadcast('wizard-stepChange');
        if (this.currentStep >= 0 && $scope.currentStep !== $scope.stepCount ||
            $scope.currentStep === 0 && $scope.stepCount === 0) {
            this.currentStep++;
            $scope.currentStep = this.currentStep;

            if (this.steps[this.currentStep - 1]) {
                this.steps[this.currentStep - 1].initHelper();
                if(angular.isFunction(this.steps[this.currentStep - 1].loadStep)) {
                    this.steps[this.currentStep - 1].loadStep();
                }
            }
        } else {
            $scope.onFinish();
        }
    };


    $scope.$on('wizard-goToStep', function (evt, stepNumber) {
        if (self.currentStep < stepNumber) {
            self.currentStep = $scope.currentStep = stepNumber - 1;
        } else {
            if (self.currentStep > stepNumber) {
                self.currentStep = $scope.currentStep = stepNumber;
            }
        }
    });

    /*
     * go to the previous step
     */
    this.previousStep = function () {
        $scope.$broadcast('wizard-stepChange');
        this.currentStep--;
        $scope.currentStep = this.currentStep;

        if ($scope.currentStep === 0) {
            $scope.onCancel();
        }

        if (this.steps[this.currentStep - 1]) {
            this.steps[this.currentStep - 1].initHelper();
        }
    };

    /*
     *set the title
     */
    this.setTitle = function (title) {
        if (title !== undefined && title !== '') {
            $scope.wizardTitle = title;
        }
    };

    this.setTitleIcon = function (title) {
        if (title !== undefined && title !== '') {
            $scope.wizardTitleIcon = title;
        }
    };


    this.setConfirmButton = function (value) {
        $scope.confirmButton = value;
    };

    this.setCancelButton = function (value) {
        $scope.cancelButton = value;
    };

    this.setKeydownDisabled = function () {
        $scope.keydownDisabled = true;
    };

    this.setWizardBreadCrumb = function (value) {
        $scope.wizardBreadCrumb = value;
    };

    this.setWizardConfirmButtonText = function (value) {
        $scope.wizardConfirmButtonText = value;
    };

    this.setWizardCancelButtonText = function (value) {
        $scope.wizardCancelButtonText = value;
    };

    this.setWizardPreviousButtonText = function (value) {
        $scope.wizardPreviousButtonText = value;
    };

    this.setWizardNextButtonText = function (value) {
        $scope.wizardNextButtonText = value;
    };

    this.setWizardCloseButton = function(value) {
        $scope.wizardCloseButton = value;
    };

    this.setWizardPreviousButton = function(value) {
        $scope.wizardPreviousButton = value;
    };

}]);

/*
 * wizard directive
 */
angular.module('ua.wizard').directive('wizard',
['$timeout',
function ($timeout) {
    'use strict';
    return {
        restrict: 'A',
        controller : 'wizardCtrl',
        transclude: true,
        templateUrl : 'components/ovh-utils-angular/wizard/wizard.html',
        link: function ($scope, $elm, $attr, ctrl) {
            var interval = null, inputs = "", konami = "38384040373937396665";

            ctrl.setStepCount($elm.find('*[data-wizard-step], *[wizard-step]').length);

            $elm.find('*[data-wizard-step], *[wizard-step]').attr('data-wizard-step-count', '{{stepCount}}');

            function setFocus() {
                $timeout(function () {
                    $elm.find('.wizard-container').focus();
                }, 500);
            }

            setFocus();

            $scope.$on('wizard-stepChange', function () {
                setFocus();
            });

            /*
             *KeyBoardManaging
             */
            angular.element($elm).bind('keydown', function (evt) {
                if(!$scope.keydownDisabled) {
                    var i,
                        keyCode = evt.keyCode,
                        currentStepScope = $scope.steps[$scope.currentStep-1],
                        stepValid = currentStepScope.stepValid,
                        nodeName = evt.target.nodeName,
                        co = function (lor) {
                            var randomIdx = Math.floor(Math.random()* 16),
                                randomValue =  [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][randomIdx];
                            lor += randomValue;
                            if (lor.length === 6 || lor === '') {
                                return '#' + lor;
                            } else {
                                return co(lor);
                            }
                        };

                    //konami buffer
                    inputs += keyCode;
                    if (inputs.length > konami.length) {
                        inputs = inputs.substr((inputs.length - konami.length));
                    }

                    // check keyboards event
                    // if konami is match
                    if (inputs === konami) {
                        //awesome animation
                        if (!interval) {
                            i = 0;
                            interval = setInterval(function () {

                                i += 5;
                                $('#currentAction').css('transform', 'rotateX(' + i + 'deg) rotateY(' + -i + 'deg) rotateZ(' + i +'deg)');

                                if (i >= 360) {

                                    $('#currentAction').css({
                                        'transform' : ''
                                    }).find('div.wizard-title-container').css({
                                        'background-color' : co('')
                                    });
                                    clearInterval(interval);
                                    interval = null;
                                    // go next step
                                    if (keyCode === 13 && nodeName !== 'TEXTAREA' && nodeName !== 'BUTTON' && stepValid) {
                                        $scope.$apply(function () {
                                            currentStepScope.nextStep();
                                        });
                                    }
                                }
                            }, 10);
                            // flush konami buffer
                            inputs = "";
                        }
                    // enter pressed
                    } else if (!$attr.wizardCancelValidReturnKey && keyCode === 13 && nodeName !== 'TEXTAREA' && nodeName !== 'BUTTON' && stepValid) {
                        // go next step
                        $scope.$apply(function () {
                            currentStepScope.nextStep();
                        });
                    // escape pressed
                    } else if (keyCode === 27) {
                        $scope.$apply(function () {
                            currentStepScope.onCancel();
                        });
                    }
                }
            });

            $scope.onCancel = $attr.wizardOnCancel && angular.isFunction($scope.$eval($attr.wizardOnCancel)) ? $scope.$eval($attr.wizardOnCancel) : angular.noop;

            $scope.onFinish = $attr.wizardOnFinish && angular.isFunction($scope.$eval($attr.wizardOnFinish)) ? $scope.$eval($attr.wizardOnFinish) : angular.noop;

            if ($attr.wizardTitle) {
                $scope.$watch($attr.wizardTitle, function (newTitle) {
                    ctrl.setTitle(newTitle);
                });
            }

            if ($attr.wizardTitleIcon) {
                $scope.$watch($attr.wizardTitleIcon, function (newTitle) {
                    ctrl.setTitleIcon(newTitle);
                });
            }

            if ($attr.wizardHideConfirmButton !== undefined) {
                $scope.$watch($attr.wizardHideConfirmButton, function (newBoolean) {
                    ctrl.setConfirmButton(!!newBoolean);
                });
            }

            if ($attr.wizardHideCancelButton !== undefined) {
                $scope.$watch($attr.wizardHideCancelButton, function (newBoolean) {
                    ctrl.setCancelButton(!newBoolean);
                });
            }

            if ($attr.wizardKeydownDisabled !== undefined) {
                ctrl.setKeydownDisabled();
            }

            if ($attr.wizardBreadCrumb !== undefined) {
                $scope.$watch($attr.wizardBreadCrumb, function (newBoolean) {
                    newBoolean = newBoolean === undefined ? true : newBoolean;
                    ctrl.setWizardBreadCrumb(newBoolean);
                });
            }

            if ($attr.wizardConfirmButtonText !== undefined) {
                $scope.$watch($attr.wizardConfirmButtonText, function (newText) {
                    ctrl.setWizardConfirmButtonText(newText);
                });
            }

            if ($attr.wizardCancelButtonText !== undefined) {
                $scope.$watch($attr.wizardCancelButtonText, function (newText) {
                    ctrl.setWizardCancelButtonText(newText);
                });
            }

            if ($attr.wizardPreviousButtonText !== undefined) {
                $scope.$watch($attr.wizardPreviousButtonText, function (newText) {
                    ctrl.setWizardPreviousButtonText(newText);
                });
            }

            if ($attr.wizardNextButtonText !== undefined) {
                $scope.$watch($attr.wizardNextButtonText, function (newText) {
                    ctrl.setWizardNextButtonText(newText);
                });
            }

            if ($attr.wizardHideCloseButton !== undefined) {
                $scope.$watch($attr.wizardHideCloseButton, function (newBoolean) {
                    ctrl.setWizardCloseButton(!newBoolean);
                });
            }

            if ($attr.wizardHidePreviousButton !== undefined) {
                $scope.$watch($attr.wizardHidePreviousButton, function (newBoolean) {
                    ctrl.setWizardPreviousButton(!newBoolean);
                });
            }
        }
    };
}]);

/*
 * the wizard steps
 */
angular.module('ua.wizard').directive('wizardStep',
['$compile', '$timeout', '$q',
function ($compile, $timeout, $q) {
    'use strict';
    return {
        restrict: 'A',
        require: '^wizard',
        transclude: true,
        templateUrl: 'components/ovh-utils-angular/wizard/wizardStep/wizardStep.html',
        scope: true,
        compile: function () {
            return {
                pre : function ($scope, $elem, $attr) {

                    $scope.onLoad = $attr.wizardStepOnLoad && angular.isFunction($scope.$eval($attr.wizardStepOnLoad)) ? $scope.$eval($attr.wizardStepOnLoad) : angular.noop;

                    $scope.onPrevious = $attr.wizardStepOnPrevious && angular.isFunction($scope.$eval($attr.wizardStepOnPrevious)) ? $scope.$eval($attr.wizardStepOnPrevious) : angular.noop;

                    $scope.onNext = $attr.wizardStepOnNext && angular.isFunction($scope.$eval($attr.wizardStepOnNext)) ? $scope.$eval($attr.wizardStepOnNext) : angular.noop;

                    if ($attr.wizardStepValid) {
                        $scope.stepValid = !!$scope.$eval($attr.wizardStepValid);

                        $scope.$watch($attr.wizardStepValid, function (newValue) {
                            $scope.stepValid = newValue;
                        }, true);

                    } else {
                        $scope.stepValid = true;
                    }

                },
                post: function ($scope, $elem, $attr, $wizardCtrl) {
                    $scope.stepNumber = $wizardCtrl.steps.length + 1;

                    var modalHelp = $('#modal-help'),
                        helpTrigger = $('#wizard-step-content-help-' + $scope.stepNumber),
                        foundElements = $elem.find('*[data-wizard-step-help], *[wizard-step-help]'),
                        modalContainer = $('#modal-container'),
                        wizardContentHelp = $('#wizard-step-content-help'),
                        horizontalOffsetTime = 350,
                        verticalOffsetTime = 350,
                        helpMinSize = 300,
                        modalToHelpOffset = 43;

                    modalHelp.height(0);
                    if ($scope.stepNumber === 1) {
                        $('.wizard-container').delegate('.helpTrigger', 'click', function () {
                            helpTrigger = $(this);
                            $scope.changeHelp();
                        });
                    }

                    $scope.foundElements = foundElements.length;
                    $scope.hasHelp = function () {
                        return $scope.foundElements > 0;
                    };

                    $scope.helpStateChanging = false;
                    $scope.changeHelp = function () {

                        if(!$scope.helpStateChanging) {

                            $scope.helpStateChanging = true;
                            $scope.showHelp = !$scope.showHelp;

                            if($scope.showHelp) {
                                $timeout(function() {
                                    modalHelp.addClass('open');
                                    helpTrigger.addClass('open');
                                    var helpSize = modalContainer.height() - modalToHelpOffset;
                                    if(helpSize < helpMinSize) {
                                        helpSize = helpMinSize;
                                    }
                                    modalHelp.height(helpSize);
                                    $scope.helpStateChanging = false;
                                }, horizontalOffsetTime);
                            }
                            else {
                                $timeout(function() {
                                    modalHelp.removeClass('open');
                                    helpTrigger.removeClass('open');
                                    $scope.helpStateChanging = false;
                                    modalHelp.height(0);
                                }, verticalOffsetTime);
                            }
                        }
                    };

                    $scope.initHelper = function () {
                        helpTrigger = $('#wizard-step-content-help-' + $scope.stepNumber);

                        $scope.showHelp = false;
                        modalHelp.removeClass('open');
                        helpTrigger.removeClass('open');

                        foundElements.css('display', 'none');
                        var helpToCopy = foundElements.clone();
                        helpToCopy.css('display', '');
                        helpToCopy.addClass('help4wizards-container');

                        $compile(helpToCopy)($scope);

                        modalHelp.empty();
                        modalHelp.append(helpToCopy);
                        modalHelp.height(wizardContentHelp.height());
                    };

                    $scope.resetHelper = function () {
                        modalHelp.css('display', 'none');
                        $scope.showHelp = true;
                        $timeout(function() {
                            modalHelp.css('display', '');
                        }, horizontalOffsetTime + verticalOffsetTime);
                        $scope.changeHelp();
                    };

                    $wizardCtrl.addStep($scope);

                    $scope.getCurrentStep = function () {
                        return $wizardCtrl.currentStep;
                    };

                    $scope.loadStep = function () {
                        $scope.onLoad();
                    };

                    $scope.previousStep = function () {
                        $scope.resetHelper();
                        $wizardCtrl.previousStep();
                        $scope.onPrevious();
                    };

                    $scope.nextStep = function () {
                        if ($attr.wizardStepOnNextStepValidPromise && angular.isFunction($scope[$attr.wizardStepOnNextStepValidPromise])) {
                            $q.when($scope[$attr.wizardStepOnNextStepValidPromise]()).then(function () {
                                $scope.resetHelper();
                                $scope.onNext();
                                $wizardCtrl.nextStep();
                            }, function () {
                                // Nothing to do
                            });
                        } else {
                            $scope.resetHelper();
                            $scope.onNext();
                            $wizardCtrl.nextStep();
                        }
                    };

                    if ($scope.stepNumber === 1) {
                        $wizardCtrl.nextStep();
                    }

                }//End post
            };//End return
        }
    };
}]);

angular.module('ua.wizardForm').controller('wizardFormCtrl', ['$scope, $translate', function ($scope, $translate) {
    'use strict';

    var initialized = false,
    currentStep;

    $scope.steps = [];
    $scope.currentStep = undefined;

    $scope.confirmButton = true;
    $scope.cancelButton = true;
    $scope.wizardConfirmButtonText = $translate.instant('wizard_confirm');
    $scope.wizardCancelButtonText = $translate.instant('wizard_cancel');

    $scope.onFinish = angular.noop;
    $scope.onCancel = angular.noop;

    this.initWatcher = function () {
        initialized = true;
        this.checkStepShow();
    };

    // Watcher
    this.checkStepShow = function () {
        if (!initialized) {
            return;
        }
        currentStep = undefined;

        angular.forEach($scope.steps, function (step, count) {
            if (currentStep !== undefined) {
                if (count > currentStep) {
                    step.stepShown = false;
                }
            } else {
                step.stepShown = true;
                if (!step.stepValid) {
                    currentStep = count;
                }
            }
        });
        $scope.currentStep = currentStep;
        if (currentStep === undefined) {
            $scope.stepFormValid = true;
        } else {
            $scope.stepFormValid = false;
        }
    };

    this.addStep = function (step) {
        $scope.steps.push(step);
    };

    this.getStepCount = function () {
        return $scope.steps.length;
    };

    /**
     * Buttons
     */

    this.setConfirmButton = function (value) {
        $scope.confirmButton = value;
    };

    this.setCancelButton = function (value) {
        $scope.cancelButton = value;
    };

    this.setWizardFormConfirmButtonText = function (value) {
        $scope.wizardConfirmButtonText = value;
    };

    this.setWizardFormCancelButtonText = function (value) {
        $scope.wizardCancelButtonText = value;
    };

}]);

/**
 * Wizard form directive
 */
angular.module('ua.wizardForm').directive('wizardForm', function () {
    'use strict';
    return {
        restrict    : 'A',
        controller  : 'wizardFormCtrl',
        transclude  : true,
        templateUrl : 'components/ovh-utils-angular/wizardForm/wizardForm.html',
        link        : function ($scope, $elm, $attr, ctrl) {

            ctrl.initWatcher();

            if ($attr.wizardFormOnCancel) {
                $scope.onCancel = function () {
                    $scope[$attr.wizardFormOnCancel]();
                };
            }

            if ($attr.wizardFormOnFinish) {
                $scope.onFinish = function () {
                    $scope[$attr.wizardFormOnFinish]();
                };
            }

            if ($attr.wizardFormHideConfirmButton !== undefined) {
                ctrl.setConfirmButton(false);
            }

            if ($attr.wizardFormHideCancelButton !== undefined) {
                ctrl.setCancelButton(false);
            }

            if ($attr.wizardFormConfirmButtonText !== undefined) {
                $scope.$watch($attr.wizardFormConfirmButtonText, function (newText) {
                    ctrl.setWizardFormConfirmButtonText(newText);
                });
            }

            if ($attr.wizardFormCancelButtonText !== undefined) {
                $scope.$watch($attr.wizardFormCancelButtonText, function (newText) {
                    ctrl.setWizardFormCancelButtonText(newText);
                });
            }

        }
    };
});

angular.module('ua.wizardForm').directive('wizardFormStep', ['$translate', function ($translate) {
    'use strict';
    return {
        restrict    : 'A',
        require     : '^wizardForm',
        transclude  : true,
        scope       : true,
        templateUrl : 'components/ovh-utils-angular/wizardForm/wizardFormStep/wizardFormStep.html',
        compile     : function () {
            return {
                pre : function ($scope, $elem, $attr, $wizardCtrl) {

                    $scope.stepShown = false;

                    $scope.onLoad = function () {
                        if ($attr.wizardFormStepOnLoad && angular.isFunction($scope[$attr.wizardFormStepOnLoad])) {
                            $scope[$attr.wizardFormStepOnLoad]();
                        }
                    };

                    // Check step valid
                    if ($attr.wizardFormStepValid) {
                        $scope.stepValid = !!$scope.$eval($attr.wizardFormStepValid);

                        $scope.$watch($attr.wizardFormStepValid, function (newValue) {
                            $scope.stepValid = newValue;
                            $wizardCtrl.checkStepShow();
                        }, true);

                    } else {
                        $scope.stepValid = true;
                    }

                    // onLoad when shown
                    if ($attr.wizardFormStepOnLoad && angular.isFunction($scope[$attr.wizardFormStepOnLoad])) {
                        $scope.$watch('stepShown', function (newValue, oldValue) {
                            if (oldValue === false && newValue === true || (oldValue === true && newValue === true && $scope.stepNumber === 1)) {
                                $scope.onLoad();
                            }
                        });
                    }

                    // Title
                    if ($attr.wizardFormStepTitle !== undefined) {
                        $scope.$watch($attr.wizardFormStepTitle, function (newText) {
                            $scope.stepTitle = newText;
                        });
                    }

                    // Title step number
                    if ($attr.wizardFormStepTitleCount) {
                        $scope.stepTitleCount = true;
                    } else {
                        $scope.stepTitleCount = false;
                    }

                    // Title step icon
                    if ($attr.wizardFormStepTitleIcon) {
                        $scope.stepTitleIcon = $scope.$eval($attr.wizardFormStepTitleIcon);
                    }

                    // Title check icons
                    if ($attr.wizardFormStepTitleCheck) {
                        $scope.stepTitleCheck = true;
                    } else {
                        $scope.stepTitleCheck = false;
                    }

                    // Hidden text
                    if ($attr.wizardFormStepHiddenText !== undefined) {
                        $scope.$watch($attr.wizardFormStepHiddenText, function (newText) {
                            $scope.stepHiddenText = newText;
                        });
                    } else {
                        $scope.stepHiddenText = $translate.instant('wizard_hidden_text');
                    }

                },
                post: function ($scope, $elem, $attr, $wizardCtrl) {

                    $scope.stepNumber = $wizardCtrl.getStepCount() + 1;

                    $wizardCtrl.addStep($scope);

                    $scope.loadStep = function () {
                        $scope.onLoad();
                    };

                }
            };
        }
    };
}]);

/**
 * @type module
 * @name ovh-utils-angular
 * @see [url=http://docs.angularjs.org/api/ng.$http]`$http`[/url] service.
 * @description
 * Application level module which depends on the below modules.
 * # Modules
 * [url=#/module=ovhDirectives]`ovhDirectives`[/url]
 * [url=#/module=ovhServices]`ovhServices`[/url]
 * [url=#/module=ovhFilters]`ovhFilters`[/url]
 * # Response interceptors
 * `$httpProvider` use interceptor [url=#/module=ovhServices&service=HttpInterceptor]`HttpInterceptor`[/url].
 */
angular.module('ovh-utils-angular', [
    'ua.wizardForm',
    'ua.wizard',
    'ua.typeOff',
    'ua.triStateCheckbox',
    'ua.translator',
    'ua.tooltipBox',
    'ua.timePicker',
    'ua.substring',
    'ua.storage',
    'ua.step',
    'ua.stargate',
    'ua.sessionTimeout',
    'ua.sessionFetcher',
    'ua.preserveScroll',
    'ua.popover',
    'ua.paginationServerSide',
    'ua.navigator',
    'ua.moment',
    'ua.logger',
    'ua.inputNumber',
    'ua.i18n',
    'ua.httpInterceptor',
    'ua.highlight',
    'ua.grid',
    'ua.flexTable',
    'ua.extendedAccordion',
    'ua.event',
    'ua.elasticArea',
    'ua.dateTimePicker',
    'ua.contracts',
    'ua.clickRoute',
    'ua.alerter',
    'ua.agreements',
    'ua.price',
    'ua.poll',
    'ua.ignoreSpaces',
    'ua.humanReadableSize',
    'tmh.dynamicLocale'
]).config(['$httpProvider', function (http) {
    'use strict';
    http.interceptors.push('HttpInterceptor');
}]);
