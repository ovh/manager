export default /* @ngInject */ function($timeout, $parse) {
  return {
    restrict: 'A',
    replace: false,
    link(scope, element, attrs) {
      const model = $parse(attrs.hasFocus);
      scope.$watch(model, (value) => {
        if (value === true) {
          $timeout(() => {
            element[0].focus();
            if ('hasFocusSelect' in attrs) element[0].select();
          });
        }
      });
      element.bind('blur', () => {
        scope.$apply(model.assign(scope, false));
      });
    },
  };
}
