/**
 * @ngdoc directive
 * @name ngOvhFormFlat.directive:flat-checkbox
 * @restrict EA
 *
 * @description
 * <p>Checkbox for manager V6</p>
 * @example
   <example module="myApp">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <flat-checkbox>
                <input name="foo"
                    id="foo"
                    data-ng-model="checkModel"
                    type="checkbox">
            </flat-checkbox>
            <label for="foo">
                    <strong>Check me</strong>
            </label>
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
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: '<div class="flat-checkbox" data-ng-transclude></div>',
    link($scope, element) {
      element.append(`
        <div class="flat-checkbox-off"></div>
        <div class="flat-checkbox-on"></div>
      `);
    },
  };
}
