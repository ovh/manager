export default /* @ngInject */ ($parse) => ({
  restrict: 'A',
  link($scope, $element, $attrs) {
    $element.on('keyup', (e) => {
      if (e && (e.keyCode === 13 || e.keyCode === 32) && $attrs.ngClick) {
        $parse($attrs.ngClick)($scope);
        $scope.$apply();
      }
    });
  },
});
