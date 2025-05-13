/**
 * @ngdoc directive
 * @name ng-ovh-timeline.directive:timeline-heading
 * @restrict AE
 *
 * @description
 * Optional element to show the heading for a `timeline-panel`.
 */
export default /* @ngInject */ function() {
  return {
    require: '^timelinePanel',
    restrict: 'AE',
    transclude: true,
    template: '<div class="timeline-heading" ng-transclude></div>',
  };
}
