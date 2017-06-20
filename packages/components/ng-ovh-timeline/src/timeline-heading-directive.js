/*global angular*/

/**
 * @ngdoc directive
 * @name ovh-angular-timeline.directive:timeline-heading
 * @restrict AE
 *
 * @description
 * Optional element to show the heading for a `timeline-panel`.
 */
angular.module('ovh-angular-timeline').directive('timelineHeading', function() {
  'use strict';
  return {
    require: '^timelinePanel',
    restrict: 'AE',
    transclude: true,
    template: '<div class="timeline-heading" ng-transclude></div>'
  };
});
