import angular from 'angular';
import isNumber from 'lodash/isNumber';

export default /* @ngInject */ ($timeout) => ({
  restrict: 'A',
  link(scope, element, attrs) {
    const opts = scope.$eval(attrs.cucSmoothScrollHere);
    const delay = opts && isNumber(opts.delay) ? opts.delay : 500;
    const offset = opts && isNumber(opts.offset) ? opts.offset : 0;
    let maxRetries = 5;

    function tryScroll() {
      if (element.height()) {
        angular.element('html,body').animate(
          {
            scrollTop: Math.max(0, element.offset().top + offset),
          },
          delay,
        );
      } else if (maxRetries > 0) {
        maxRetries -= 1;
        $timeout(tryScroll, 99);
      }
    }

    $timeout(tryScroll, 99);
  },
});
