import controller from './controller';
import template from './template.html';

export default {
  transclude: true,
  template,
  controller,
  bindings: {
    contact: '=ngModel',
    onlyCreate: '@ovhContactOnlyCreate',
    choiceOptions: '=?ovhContactChoiceOptions',
    initDeferred: '=?ovhContactInitDeferred',
  },
};
