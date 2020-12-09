/**
 * @ngdoc directive
 * @name ngOvhFormFlat.directive:flat-select
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
        angular.module("myApp", ["ngOvhFormFlat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
export default function () {
  const CSS_FOCUS = 'flat-focus';

  return {
    restrict: 'EA',
    require: ['^?flatInputContainer', 'ngModel'],
    link($scope, elem, attrs, ctrls) {
      const containerCtrl = ctrls[0];
      const ngModelCtrl = ctrls[1];

      elem.wrap('<div class="flat-select"></div>');

      elem.on({
        focus() {
          elem.parent().addClass(CSS_FOCUS);
        },
        blur() {
          elem.parent().removeClass(CSS_FOCUS);
        },
      });

      if (containerCtrl) {
        $scope.$watch(
          () => ngModelCtrl.$dirty,
          (value) => {
            containerCtrl.setDirty(value);
          },
        );

        $scope.$watch(
          () => ngModelCtrl.$valid,
          (value) => {
            containerCtrl.setItemValidity(ngModelCtrl.$name, value);
          },
        );

        $scope.$watch(
          () => ngModelCtrl.$viewValue,
          (value) => {
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
          },
        );

        containerCtrl.setItemValidity(ngModelCtrl.$name, ngModelCtrl.$valid);
      }
    },
  };
}
