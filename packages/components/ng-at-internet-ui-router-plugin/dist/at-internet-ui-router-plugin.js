"use strict";

/**
 * @ngdoc overview
 * @name atInternetUiRouterPlugin
 * @description
 * # atInternetUiRouterPlugin
 *
 * Plugin for at-internet when using ui-router
 */
angular.module("atInternetUiRouterPlugin", ["ng-at-internet", "ui.router"])

/**
 * @ngdoc service
 * @require ng-at-internet, ui.router
 * @name atInternetUiRouterPluginProvider
 * @description
 * Provider allowing configuration for atInternetUiRouterPlugin.
 */
    .provider("atInternetUiRouterPlugin", function () {

        var stateTrackEnabled = false;
        var stateFilters = [];

    /**
     * @ngdoc function
     * @name atInternetUiRouterPluginProvider.setTrackStateChange
     * @methodOf atInternetUiRouterPluginProvider
     * @param {Boolean} state True to enable automatic state tracking, false otherwise.
     * @description
     * Enable or disable automatic state tracking (sends a page tracking data on each state change).
     */
        this.setTrackStateChange = function (state) {
            stateTrackEnabled = state;
        };

    /**
     * @ngdoc function
     * @name atInternetUiRouterPluginProvider.addStateFilter
     * @param {Function} callback Callback to apply to each state name before sending it.
     * @description
     * Apply the given callback function to each state name before sending it.
     * Example :
     * ```javascript
     * atInternetUiRouterPluginProvider.addStateNameFilter = function (stateName) {
     *     return stateName.replace("foo", "bar");
     * }
     * ```
     */
        this.addStateNameFilter = function (callback) {
            stateFilters.push(callback);
        };

        this.$get = function () {
            return {

            /**
             * @ngdoc
             * @name isStateTrackEnabled
             * @methodOf atInternetUiRouterPlugin
             * @description returns True if automatic state traking is enabled, false otherwise.
             */
                isStateTrackEnabled: function () {
                    return stateTrackEnabled;
                },

            /**
             * @ngdoc
             * @name getStateFilters
             * @methodOf atInternetUiRouterPlugin
             * @description returns the list of state name filers.
             */
                getStateFilters: function () {
                    return stateFilters;
                }
            };
        };
    })
    .config(["$stateProvider", function ($stateProvider) {

        $stateProvider.decorator("atInternetStateDecorator", function (state) {
            state.resolve.atinternet = ["$injector", "atInternet", "atInternetUiRouterPlugin", function ($injector, atInternet, atInternetUiRouterPlugin) {

                var options = state.self.atInternet;
                var ignore = options && options.ignore;
                var trackPage = {};

                if (atInternetUiRouterPlugin.isStateTrackEnabled() && !ignore) {
                    trackPage.name = state.self.name;
                    if (options) {
                        if (options.rename) {
                            trackPage.name = options.rename;
                            if (angular.isFunction(options.rename)) {
                                trackPage.name = $injector.invoke(options.rename);
                            }
                        }
                        if (options.level2) {
                            trackPage.level2 = options.level2;
                            if (angular.isFunction(options.level2)) {
                                trackPage.level2 = $injector.invoke(options.level2);
                            }
                        }
                    }

                // apply state filters if any
                    _.forEach(atInternetUiRouterPlugin.getStateFilters(), function (filter) {
                        if (_.isFunction(filter)) {
                            trackPage.name = filter.apply(null, [trackPage.name]);
                        }
                    });
                    if (trackPage.name) {
                        atInternet.trackPage(trackPage);
                    }
                }
            }];
        });
    }]);
