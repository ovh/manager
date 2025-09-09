import template from './dateCondition.template.html';
import controller from './dateCondition.controller';

export const name = 'iamConditionDate';

export default {
  bindings: {
    condition: '=ngModel',
    criterion: '<',
  },
  require: '^ngModel',
  template,
  controller,
};
