export default /* @ngInject */ function popoverOnOutsideClickDirective(
  $parse,
  $timeout,
) {
  let mouseDownListener = false;
  return {
    restrict: 'A',
    link: (scope, element, attrs) => {
      function mouseDownHandler(e) {
        // get the popover's bounds
        const { left, top, right, bottom } = angular
          .element('.popover-content')[0]
          .getBoundingClientRect();
        // get mouse coordinates
        const { clientX, clientY } = e;
        // check if mouse event is outside of popover's bounds
        const outsideClick =
          clientX < left ||
          clientX > right ||
          clientY < top ||
          clientY > bottom;
        // if it's outside ...
        if (outsideClick) {
          // ... trigger the event only if user intended to start an action
          if (['BUTTON', 'A'].includes(e.target?.tagName)) {
            $timeout(() => $parse(attrs.popoverOnOutsideClick)(scope));
          }
        }
      }

      // stop listening for mouse events
      function cleanUp() {
        if (mouseDownListener) {
          document.body.removeEventListener('mousedown', mouseDownHandler);
          mouseDownListener = false;
        }
      }

      // watch for popover state (open/close)
      scope.$watch(attrs.popoverIsOpen, (isOpen) => {
        if (isOpen && !mouseDownListener) {
          document.body.addEventListener('mousedown', mouseDownHandler);
          mouseDownListener = true;
        } else if (!isOpen) {
          cleanUp();
        }
      });

      scope.$on('$destroy', () => {
        cleanUp();
      });
    },
  };
}
