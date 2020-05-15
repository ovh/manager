/**
 * @ngdoc directive
 * @name ng-ovh-timeline.directive:timeline-badge
 * @restrict AE
 *
 * @description
 * Shown in the centre pane (or left on narrow devices) to indicate the activity.
 */
export default /* @ngInject */ function() {
  return {
    require: '^timelineEvent',
    restrict: 'AE',
    transclude: true,
    template: '<div ng-transclude class="timeline-badge"></div>',
  };
}
