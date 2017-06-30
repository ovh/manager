/**
 * @ngdoc directive
 * @name ovh-angular-form-flat.directive:flat-radio
 * @restrict EA
 *
 * @description
 * <p>Radio for manager V6</p>
 * @example
   <example module="myApp">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <flat-radio>
            </flat-radio>
        </div>
   </file>
   <file name="script.js">
        angular.module("myApp", ["ovh-angular-form-flat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
angular.module("ovh-angular-form-flat").directive("flatRadio", function () {
    "use strict";

    return {
        restrict: "EA",
        replace: true,
        transclude: true,
        template: '<div class="flat-radio" ng-transclude></div>',
        link: function ($scope, element) {
            element.append(
                '<div class="flat-radio-off"></div>' +
                '<div class="flat-radio-on"></div>'
            );
        }
    };
});
