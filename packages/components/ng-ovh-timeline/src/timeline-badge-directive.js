/*global angular*/

/**
 * @ngdoc directive
 * @name ovh-angular-timeline.directive:timeline-badge
 * @restrict AE
 *
 * @description
 * Shown in the centre pane (or left on narrow devices) to indicate the activity.
 */
angular.module('ovh-angular-timeline').directive('timelineBadge', function() {
  'use strict';
  return {
    require: '^timelineEvent',
    restrict: 'AE',
    transclude: true,
    template: '<div ng-transclude class="timeline-badge"></div>'
  };
});
