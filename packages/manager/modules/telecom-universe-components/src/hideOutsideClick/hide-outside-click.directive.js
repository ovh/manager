import $ from 'jquery';

/**
 *  Trigger that can be used with uib popover to combine existing "none" open trigger
 *  with "outsideClick" close trigger.
 *  As we can't use "outsideClick" trigger to close popover with other defined open triggers,
 *  we can use this directive to achieve this goal.
 *  Into your popover template add the directive to the root element and this will do the job:
 *  close popover when clicking outside it!
 */
export default /* @ngInject */ ($parse, $timeout) => ({
  restrict: 'A',
  link(scope, element, attrs) {
    const handler = function (event) {
      if (!$(event.target).closest(element).length) {
        scope.$apply(() => {
          $parse(attrs.tucHideOutsideClick)(scope);
        });
      }
    };

    $timeout(() => {
      // Timeout is to prevent the click handler from immediately
      // firing upon opening the popover.
      $(document).on('mousedown', handler);
    });

    scope.$on('$destroy', () => {
      $(document).off('mousedown', handler);
    });
  },
});
