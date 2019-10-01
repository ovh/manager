import $ from 'jquery';

export default /* @ngInject */ $window => ({
  restrict: 'A',
  link(scope, element) {
    const delay = 250;
    const offset = -100;

    if ($window.scrollY > element.offset().top + offset) {
      $('html,body').animate({
        scrollTop: Math.max(0, element.offset().top + offset),
      }, delay);
    }
  },
});
