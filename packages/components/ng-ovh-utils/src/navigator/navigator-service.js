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
