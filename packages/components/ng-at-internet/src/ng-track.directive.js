"use strict";

/**
 * @ngdoc directive
 * @require atInternetProvider
 * @name trackOn
 * @description
 * Simple attribute directive to track events on DOM elements.
 *
 * Example:
 * ```html
 * <button data-track-on="click" data-track-name="MyAction" data-track-type="navigation"></button>
 * ```
 */
angular.module("ng-at-internet")
    .directive("trackOn", function (atInternet) {
        return {
            restrict: "A",
            scope: {
                trackOn: "@",
                trackName: "@",
                trackType: "@"
            },
            link: function ($scope, $element, $attr) {
                $element.on($scope.trackOn, function () {
                    var clickData = {
                        name: $attr.trackName || ($attr.id + "-" + $scope.trackOn),
                        type: $attr.trackType || "action"
                    };

                    atInternet.trackClick(clickData);
                });
            }
        };
    });
