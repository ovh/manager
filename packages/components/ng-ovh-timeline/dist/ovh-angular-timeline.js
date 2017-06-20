angular.module('ovh-angular-timeline', ['ngSanitize']);
// Source: src/timeline-badge-directive.js
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
return {
    require: '^timelineEvent',
    restrict: 'AE',
    transclude: true,
    template: '<div ng-transclude class="timeline-badge"></div>'
  };
});

// Source: src/timeline-directive.js
/*global angular*/
/**
 * @ngdoc directive
 * @name ovh-angular-timeline.directive:timeline
 * @restrict AE
 *
 * @description
 * Primary container for displaying a vertical set of timeline events.
 */
angular.module('ovh-angular-timeline').directive('timeline', function() {
return {
    restrict: 'AE',
    transclude: true,
    template: '<ul class="timeline" ng-transclude></ul>',
    controller: function() {}
  };
});

// Source: src/timeline-event-directive.js
/*global angular*/

/**
 * @ngdoc directive
 * @name ovh-angular-timeline.directive:timeline-event
 * @restrict AE
 *
 * @description
 * Represents an event occuring at a point in time, displayed on the left or the right
 * of the timeline line.
 *
 * @param {string=} side       Define if the side of each elements (ie side="'right'")
 * @param {string=} distribute Define the alternate distribution (ie distribution="'left'")
 *
 * You typically embed a `timeline-badge` and `timeline-panel` element within a `timeline-event`.
 */
angular.module('ovh-angular-timeline').directive('timelineEvent', function() {
return {
    require: '^timeline',
    restrict: 'AE',
    transclude: true,
    template: '<li ng-transclude></li>',
    link: function(scope, element, attrs) {

      var distribution = {};

      var applyInvertion = function(elt, options) {
        var liElt = elt.find('li');
        if ('undefined' !== typeof options.side) {
          // Invertion has to be forced
          switch (options.side) {
            case 'right':
              liElt.addClass('timeline-inverted');
              break;
            default:
              liElt.removeClass('timeline-inverted');
          }
        }
        else {
          // Check if toggle side
          switch (options.distribute) {
            case 'right':
              liElt.removeClass('timeline-inverted');
              liElt.addClass(options.index % 2 ? 'timeline-inverted' : '');
              break;
            case 'left':
              liElt.removeClass('timeline-inverted');
              liElt.addClass(options.index % 2 ? '' : 'timeline-inverted');
              break;
            default:
          }
        }
      };

      scope.$watch(attrs.side, function(newVal) {
        distribution.side = newVal;
        applyInvertion(element, distribution);
      });

      scope.$watch('$index', function(ind) {
        distribution.index = ind;
        applyInvertion(element, distribution);
      });

      scope.$watch(attrs.distribute, function(newVal) {
        distribution.distribute = newVal;
        applyInvertion(element, distribution);
      });

    }
  };
});

// Source: src/timeline-footer-directive.js
/*global angular*/

/**
 * @ngdoc directive
 * @name ovh-angular-timeline.directive:timeline-footer
 * @restrict AE
 *
 * @description
 * Optional element to add a footer section to the `timeline-panel` for links or other actions.
 */
angular.module('ovh-angular-timeline').directive('timelineFooter', function() {
return {
    require: '^timelinePanel',
    restrict: 'AE',
    transclude: true,
    template: '<div class="timeline-footer" ng-transclude></div>'
  };
});

// Source: src/timeline-heading-directive.js
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
return {
    require: '^timelinePanel',
    restrict: 'AE',
    transclude: true,
    template: '<div class="timeline-heading" ng-transclude></div>'
  };
});

// Source: src/timeline-panel-directive.js
/*global angular*/

/**
 * @ngdoc directive
 * @name ovh-angular-timeline.directive:timeline-panel
 * @restrict AE
 *
 * @description
 * An panel inside the `timeline-event` which shows detailed information about the event.
 */
angular.module('ovh-angular-timeline').directive('timelinePanel', function() {
return {
    require: '^timeline',
    restrict: 'AE',
    transclude: true,
    template: '<div class="timeline-panel" ng-transclude></div>'
  };
});
