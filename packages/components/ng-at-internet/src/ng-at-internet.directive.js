"use strict";

/**
 * @deprecated replaced by trackOn
 * @ngdoc directive
 * @require atInternetProvider
 * @name atInternetClick
 * @description
 * Simple attribute directive to track clicks on DOM elements.
 * Value of attribute is an object to be sent, see {@link atInternet trackClick()}.
 *
 * Example:
 * ```html
 * <button at-internet-click="{ name: 'foo' }" ng-click="clickMe()">ClickMe</button>
 * ```
 */
angular.module("ng-at-internet")
    .directive("atInternetClick", function (atInternet) {
        return {
            restrict: "A",
            scope: {
                atInternetClick: "="
            },
            compile: function () {
                return {
                    post: function ($scope, $element) {
                        $element.bind("click", function () {
                            var clickData = $scope.atInternetClick;

                        // set defaults type to action if not specified
                            if (!clickData.type) {
                                clickData.type = "action";
                            }
                            atInternet.trackClick(clickData);
                        });
                    }
                };
            }
        };
    });
