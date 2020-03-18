/**
 * @ngdoc directive
 * @name ngOvhFormFlat.directive:flat-item
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
        angular.module("myApp", ["ngOvhFormFlat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
export default function() {
  return {
    restrict: 'C',
    require: ['^flatInputContainer', 'ngModel'],
    link($scope, elem, attrs, ctrls) {
      const containerCtrl = ctrls[0];
      const ngModelCtrl = ctrls[1];

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
          containerCtrl.checkLabelVisibility(
            $scope.$eval(attrs.keepLabelWhenEmpty),
          );
          containerCtrl.checkValidity();
        },
      );

      containerCtrl.setItemValidity(ngModelCtrl.$name, ngModelCtrl.$valid);
    },
  };
}
