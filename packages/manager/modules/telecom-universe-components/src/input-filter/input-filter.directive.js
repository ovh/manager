/**
 * Simple directive to restrict user input.
 *
 * Example :
 *
 *     <input tuc-input-filter="$ctrl.myFilter" />
 *
 *     $ctrl.myFilter = function myFilter(value) {
 *         return value.replace(/\w/g, "");
 *     };
 */
export default /* @ngInject */ ($parse) => ({
  require: 'ngModel',
  restrict: 'A',
  link(scope, elt, attrs, modelCtrl) {
    const handler = $parse(attrs.tucInputFilter)(scope);
    if (handler) {
      modelCtrl.$parsers.push((value) => {
        const filtered = handler(value);
        if (filtered !== value) {
          modelCtrl.$setViewValue(filtered);
          modelCtrl.$render(filtered);
        }
        return filtered;
      });
    }
  },
});
