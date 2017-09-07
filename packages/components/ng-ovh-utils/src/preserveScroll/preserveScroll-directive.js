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
