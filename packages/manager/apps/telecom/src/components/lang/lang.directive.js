// see: https://www.w3.org/International/questions/qa-html-language-declarations
angular.module('managerApp').directive('lang', $translate => ({
  restrict: 'A',
  link(scope, element) {
    element.attr('lang', _.chain($translate.use()).words().head().value());
  },
}));
