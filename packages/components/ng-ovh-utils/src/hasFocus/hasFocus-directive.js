/**
 * @ngdoc directive
 * @name ovhDirectives.directive:hasFocus
 * @element INPUT, SELECT, TEXTAREA
 *
 * @decription
 * Whether the element receives the focus and its content selected
 *
 * @version 1.0.0
 *
 * @example
 * <code:html>
 *
 *  <input
 *      type="text"
 *      data-has-focus="true"
 *      data-has-focus-select
 *  >
 *
 * </code>
 */

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
