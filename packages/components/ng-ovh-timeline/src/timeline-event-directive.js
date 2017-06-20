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
  'use strict';
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
