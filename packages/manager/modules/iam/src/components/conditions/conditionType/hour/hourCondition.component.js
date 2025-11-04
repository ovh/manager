import template from './hourCondition.template.html';
import controller from './hourCondition.controller';

export const name = 'iamConditionHour';

export default {
  bindings: {
    condition: '=ngModel',
    criterion: '<',
  },
  require: '^ngModel',
  template,
  controller,
};
