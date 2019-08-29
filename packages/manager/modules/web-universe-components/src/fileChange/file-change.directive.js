export default () => ({
  require: 'ngModel',
  restrict: 'A',
  link(scope, elem, attrs, ngModel) {
    const setFile = () => {
      ngModel.$setViewValue(elem[0].files);
      scope.$eval(attrs.wucFileChange);
    };

    elem.on('change', () => {
      scope.$apply(setFile);
    });
  },
});
