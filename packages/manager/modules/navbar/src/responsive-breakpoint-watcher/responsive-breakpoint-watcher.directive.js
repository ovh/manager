import './responsive-breakpoint-watcher.less';

export default /* @ngInject */ ($window) => ({
  restrict: 'E',
  scope: {
    onChange: '&',
  },
  link(scope, element) {
    scope.$watch(
      () => {
        return $window.getComputedStyle(element[0]).opacity;
      },
      (opacity) => {
        scope.onChange({
          isResponsive: opacity === '0',
        });
      },
    );
  },
});
