/**
 *  @ngdoc directive
 *
 *  @name responsivePopover.directive:responsivePopoverClass
 *
 *  @description
 *  This directive manage the way the popover is displayed. This uses the configuration setted into
 *  the `responsivePopoverProvider` to detect if the popover needs to be displayed on full screen
 *  or to be displayed normally.
 *  It is automatically setted by `responsivePopover` directive.
 *
 *  **Note:** when ui-bootstrap version >= 2.0 will be used, the only thing to do should be to add
 *  a custom class with the 'popover-class' option of the uibPopover directive. To be tested.
 */
export default /* @ngInject */ function(matchmedia, responsivePopover) {
  return {
    restrict: 'C',
    link(scope, iElement) {
      const mobileMediaQuery = responsivePopover.getMobileMediaQuery();
      let isMobileDetected = false;
      let mediaQueryHandler = false;
      let scrollPosition;
      const resetFixedBody = function resetFixedBody(scrollTo) {
        const bodyElement = document.querySelector('body');
        bodyElement.classList.remove('responsive-popover-fixed-body');
        bodyElement.style.top = '';
        bodyElement.scrollTop = scrollTo;
      };

      // on method returns a function that remove the media query listener
      // @see https://github.com/AnalogJ/matchmedia-ng/blob/master/matchmedia-ng.js#L75
      mediaQueryHandler = matchmedia.on(mobileMediaQuery, (mediaQueryList) => {
        isMobileDetected = mediaQueryList.matches;

        if (isMobileDetected) {
          const bodyElement = document.querySelector('body');
          scrollPosition = bodyElement.scrollTop;
          iElement.addClass('popover-full-screen');

          bodyElement.style.top = `${scrollPosition * -1}px`;
          bodyElement.classList.add('responsive-popover-fixed-body');
        } else {
          iElement.removeClass('popover-full-screen');
          resetFixedBody(scrollPosition);
        }
      });

      scope.$on('$destroy', () => {
        // destroy media query listener
        mediaQueryHandler();

        // reset fixed body
        if (isMobileDetected) {
          resetFixedBody(scrollPosition);
        }
      });
    },
  };
}
