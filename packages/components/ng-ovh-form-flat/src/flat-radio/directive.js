/**
 * @ngdoc directive
 * @name ngOvhFormFlat.directive:flat-radio
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
        angular.module("myApp", ["ngOvhFormFlat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
export default function() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: '<div class="flat-radio" data-ng-transclude></div>',
    link($scope, element) {
      element.append(`
        <div class="flat-radio-off"></div>
        <div class="flat-radio-on"></div>
      `);
    },
  };
}
