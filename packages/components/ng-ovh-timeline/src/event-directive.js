/**
 * @ngdoc directive
 * @name ng-ovh-timeline.directive:timeline-event
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
export default /* @ngInject */ function() {
  return {
    require: '^timeline',
    restrict: 'AE',
    transclude: true,
    template: '<li ng-transclude></li>',
    link(scope, element, attrs) {
      const distribution = {};

      const applyInvertion = (elt, options) => {
        const liElt = elt.find('li');
        if (typeof options.side !== 'undefined') {
          // Invertion has to be forced
          switch (options.side) {
            case 'right':
              liElt.addClass('timeline-inverted');
              break;
            default:
              liElt.removeClass('timeline-inverted');
          }
        } else {
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

      scope.$watch(attrs.side, (newVal) => {
        distribution.side = newVal;
        applyInvertion(element, distribution);
      });

      scope.$watch('$index', (ind) => {
        distribution.index = ind;
        applyInvertion(element, distribution);
      });

      scope.$watch(attrs.distribute, (newVal) => {
        distribution.distribute = newVal;
        applyInvertion(element, distribution);
      });
    },
  };
}
