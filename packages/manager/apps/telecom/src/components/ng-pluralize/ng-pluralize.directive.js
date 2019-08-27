angular.module('managerApp').directive('ngPluralize', () => ({
  restrict: 'EA',
  priority: 1,
  transclude: 'element',
  link(scope, element, attrs, ctrl, transclude) {
    scope.$watch(attrs.when, (when) => {
      if (when) {
        transclude((clone) => {
          element.replaceWith(clone);
        });
      }
    });
  },
}));
