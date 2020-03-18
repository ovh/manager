/**
 * @ngdoc directive
 * @name ngOvhFormFlat.directive:flat-switch
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
    template: '<div class="flat-switch" data-ng-transclude></div>',
    link($scope, element, attrs) {
      const disableText = attrs.flatSwitchDisableText || '';
      const enableText = attrs.flatSwitchEnableText || '';

      element.append(`
        <div class="flat-switch-container">
            <span class="flat-switch-disable-text">${disableText}</span>
            <span class="flat-switch-enable-text">${enableText}</span>
        </div>
        <div class="flat-switch-cursor"></div>
      `);
    },
  };
}
