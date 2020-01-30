angular.module('managerApp').directive('scrollHere', () => ({
  restrict: 'A',
  link(scope, element) {
    const areaToScroll = element.offset().top - $('nav.user').height() - 50;
    $('html,body').animate(
      {
        scrollTop: areaToScroll,
      },
      1000,
    );
  },
}));
