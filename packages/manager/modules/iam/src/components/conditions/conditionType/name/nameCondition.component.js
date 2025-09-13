import template from './nameCondition.template.html';
import controller from './nameCondition.controller';

export const name = 'iamConditionName';

export default {
  bindings: {
    condition: '=ngModel',
    criterion: '<',
  },
  require: '^ngModel',
  template,
  controller,
};
