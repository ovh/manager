import head from 'lodash/head';
import words from 'lodash/words';

// see: https://www.w3.org/International/questions/qa-html-language-declarations
angular.module('managerApp').directive('lang', $translate => ({
  restrict: 'A',
  link(scope, element) {
    element.attr('lang', head(words($translate.use())));
  },
}));
