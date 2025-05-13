/**
 * @ngdoc service
 * @name responsivePopover.responsivePopoverProvider
 *
 * @description
 * responsivePopoverProvider allows developper to configure which mediaQuery will be considered
 * as a mobile.
 *
 * @example
 * <pre>
 *     angular.module("myManagerApp").config(function (responsivePopoverProvider) {
 *          // tell to the module that we consider a mobile device with at least 800px width
 *          responsivePopoverProvider.setMobileMediaQuery("(max-width: 800px)");
 *      });
 * </pre>
 */
export default function() {
  const self = this;
  let mobileMediaQuery = '(max-width: 980px)';

  /*= ====================================
    =            CONFIGURATION            =
    ===================================== */

  /**
   *  @ngdoc method
   *  @name responsivePopover.responsivePopoverProvider#setMobileMediaQuery
   *  @methodOf responsivePopover.responsivePopoverProvider
   *
   *  @description
   *  Allows you to determine what app will consider as a mobile for responsive popover display.
   *
   *  @param {String} query The matchMedia query that will be used to detect mobile.
   *
   *  @return {String} The new query provided.
   */
  self.setMobileMediaQuery = function(query) {
    if (query) {
      mobileMediaQuery = query;
    }

    return mobileMediaQuery;
  };

  /* -----  End of CONFIGURATION  ------*/

  /**
   *  @ngdoc service
   *  @name responsivePopover.service:responsivePopover
   *
   *  @description
   *  This service enable you to get configured values.
   */
  self.$get = /* @ngInject */ function() {
    return {
      /**
       *  @ngdoc method
       *  @name responsivePopover.service:responsivePopover#getMobileMediaQuery
       *  @methodOf responsivePopover.service:responsivePopover
       *
       *  @description
       *  Get the current configured media query. It is used to detect the popover display
       *  (simple popover or full screen popover for mobile).
       *
       *  @return {String} The configured mediaQuery.
       */
      getMobileMediaQuery() {
        return mobileMediaQuery;
      },
    };
  };
}
