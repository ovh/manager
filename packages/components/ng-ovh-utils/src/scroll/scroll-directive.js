export default /* @ngInject */ function scrollTopDirective(ScrollService) {
  return {
    restrict: 'A',
    link() {
      ScrollService.scrollTop();
    },
  };
}
