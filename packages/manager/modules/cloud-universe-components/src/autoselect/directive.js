export default /* @ngInject */ ($timeout) => ({
  restrict: 'A',
  link($scope, $element) {
    $timeout(() => {
      $element[0].select();
    });
  },
});
