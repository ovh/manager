/**
 * @ngdoc directive
 * @name ng-ovh-timeline.directive:timeline
 * @restrict AE
 *
 * @description
 * Primary container for displaying a vertical set of timeline events.
 */
export default /* @ngInject */ function() {
  return {
    restrict: 'AE',
    transclude: true,
    template: '<ul class="timeline" ng-transclude></ul>',
    controller() {},
  };
}
