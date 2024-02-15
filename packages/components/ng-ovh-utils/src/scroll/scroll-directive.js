/**
 *
 * @type Attribute Directive
 * @description Automatic scroll top on ui-view
 * @example use 'ovh-scroll-top as an attribute of <ui-view></ui-view> tag to make sure the view is displaying always at the top
 *
 */
export default /* @ngInject */ function scrollTopDirective(ScrollService) {
  return {
    restrict: 'A',
    link() {
      ScrollService.scrollTop();
    },
  };
}
