angular.module('managerApp').directive('filelistener', () => ({
  restrict: 'E',
  template: '<input type="file" />',
  replace: true,
  require: 'ngModel',
  link(scope, element, attr, ctrl) {
    const listener = function filelistenerListener() {
      scope.$apply(() => {
        ctrl.$setViewValue(null);
      });
      scope.$apply(() => {
        if (attr.multiple) {
          ctrl.$setViewValue(element[0].files);
        } else {
          ctrl.$setViewValue(element[0].files[0]);
        }
      });
    };
    element.bind('change', listener);
  },
}));
