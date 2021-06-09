export default /* @ngInject */ function popoverAutofocusDirective(
  $parse,
  $timeout,
) {
  return {
    restrict: 'A',
    link: (scope, element, attrs) => {
      // watch for popover state (open/close)
      scope.$watch(attrs.popoverIsOpen, (isOpen) => {
        if (isOpen) {
          $timeout(() => {
            const content = angular.element('.popover-content')[0];
            if (content) {
              // scroll to the popup
              $timeout(() => {
                content.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                  inline: 'nearest',
                });
              }, 100);
            }
          });
        } // if
      });
    },
  };
}
