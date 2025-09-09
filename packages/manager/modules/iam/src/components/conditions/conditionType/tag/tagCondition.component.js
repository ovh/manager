import template from './tagCondition.template.html';
import controller from './tagCondition.controller';

export const name = 'iamConditionTag';

export default {
  bindings: {
    condition: '=ngModel',
    criterion: '<',
  },
  require: '^ngModel',
  template,
  controller,
};
