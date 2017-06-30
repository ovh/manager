/**
 * @ngdoc directive
 * @name ovh-angular-form-flat.directive:flat-select
 * @restrict EA
 *
 * @description
 * <p>Select for manager V6</p>
 * @example
   <example module="myApp">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <flat-select>
            </flat-select>
        </div>
   </file>
   <file name="script.js">
        angular.module("myApp", ["ovh-angular-form-flat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
angular.module("ovh-angular-form-flat").directive("flatSelect", function () {
    "use strict";

    var CSS_FOCUS = "flat-focus";

    return {
        restrict: "EA",
        require: ["^?flatInputContainer", "ngModel"],
        link: function ($scope, elem, attrs, ctrls) {
            var containerCtrl = ctrls[0];
            var ngModelCtrl = ctrls[1];

            elem.wrap('<div class="flat-select"></div>');

            elem.on({
                focus: function () {
                    elem.parent().addClass(CSS_FOCUS);
                },
                blur: function () {
                    elem.parent().removeClass(CSS_FOCUS);
                }
            });

            if (containerCtrl) {
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
                        if (value) {
                            ngModelCtrl.$setDirty(true);
                        }

                        // If viewValue is empty or undefined, we advertise parent controller
                        if (!value || value.length === 0) {
                            containerCtrl.setEmpty(true);
                        } else {
                            containerCtrl.setEmpty(false);
                        }

                        containerCtrl.checkLabelVisibility();
                        containerCtrl.checkValidity();
                    }
                );

                containerCtrl.setItemValidity(ngModelCtrl.$name, ngModelCtrl.$valid);
            }
        }
    };
});
