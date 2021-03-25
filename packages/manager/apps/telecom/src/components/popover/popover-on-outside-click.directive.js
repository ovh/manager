export default /* @ngInject */ function popoverOnOutsideClickDirective(
  $parse,
  $timeout,
) {
  let outsideClickHandler = null;
  return {
    restrict: 'A',
    link: (scope, element, attrs) => {
      // watch for popover state (open/close)
      scope.$watch(attrs.popoverIsOpen, (isOpen) => {
        if (isOpen && !outsideClickHandler) {
          // first timeout is used to prevent retrieving a click event
          // when opening the popover the first time
          $timeout(() => {
            if (outsideClickHandler) {
              outsideClickHandler.off();
            }
            outsideClickHandler = angular.element('body').click((e) => {
              // click events happen outside of angular we need to use timeout
              $timeout(() => {
                const content = angular.element('.popover-content')[0];
                if (content && !content.contains(e.target)) {
                  $parse(attrs.popoverOnOutsideClick)(scope);
                }
              });
            });
          });
        } else if (!isOpen) {
          // when closing the modal stop listening
          if (outsideClickHandler) {
            outsideClickHandler.off();
            outsideClickHandler = null;
          }
        }
      });

      // cleanup
      scope.$on('$destroy', () => {
        if (outsideClickHandler) {
          outsideClickHandler.off();
          outsideClickHandler = null;
        }
      });
    },
  };
}
