/**
 * @ngdoc directive
 * @name ovh-angular-form-flat.directive:flat-switch
 * @restrict EA
 *
 * @description
 * <p>Switch for manager V6</p>
 * @example
   <example module="myApp">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <flat-switch>
            </flat-switch>
        </div>
   </file>
   <file name="script.js">
        angular.module("myApp", ["ovh-angular-form-flat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
angular.module("ovh-angular-form-flat").directive("flatSwitch", function () {
    "use strict";

    return {
        restrict: "EA",
        replace: true,
        transclude: true,
        template: '<div class="flat-switch" ng-transclude></div>',
        link: function ($scope, element, attrs) {
            var disableText = attrs.flatSwitchDisableText || "";
            var enableText = attrs.flatSwitchEnableText || "";

            element.append(
                '<div class="flat-switch-container">' +
                    '<span class="flat-switch-disable-text">' + disableText + "</span>" +
                    '<span class="flat-switch-enable-text">' + enableText + "</span>" +
                "</div>" +
                '<div class="flat-switch-cursor"></div>'
            );
        }
    };
});
