/**
 * @ngdoc directive
 * @name ovh-angular-form-flat.directive:flat-item
 * @restrict EA
 *
 * @description
 * <p>Item for manager V6</p>
 * @example
   <example module="myApp">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <flat-item>
            </flat-item>
        </div>
   </file>
   <file name="script.js">
        angular.module("myApp", ["ovh-angular-form-flat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
angular.module("ovh-angular-form-flat").directive("flatItem", function () {
    "use strict";

    return {
        restrict: "C",
        require: ["^flatInputContainer", "ngModel"],
        link: function ($scope, elem, attrs, ctrls) {
            var containerCtrl = ctrls[0];
            var ngModelCtrl = ctrls[1];

            $scope.$watch(
                function () {
                    return ngModelCtrl.$dirty;
                },
                function (value) {
                    containerCtrl.setDirty(value);
                }
            );

            $scope.$watch(
                function () {
                    return ngModelCtrl.$valid;
                },
                function (value) {
                    containerCtrl.setItemValidity(ngModelCtrl.$name, value);
                }
            );

            $scope.$watch(
                function () {
                    return ngModelCtrl.$viewValue;
                },
                function (value) {
                    // Set the input to dirty when the viewValue change
                    if (value) {
                        ngModelCtrl.$setDirty(true);
                    }

                    // If viewValue is empty or undefined, we advertise parent controller
                    if (!value || value.length === 0) {
                        containerCtrl.setEmpty(true);
                    } else {
                        containerCtrl.setEmpty(false);
                    }
                    containerCtrl.checkLabelVisibility($scope.$eval(attrs.keepLabelWhenEmpty));
                    containerCtrl.checkValidity();
                }
            );

            containerCtrl.setItemValidity(ngModelCtrl.$name, ngModelCtrl.$valid);
        }
    };
});
