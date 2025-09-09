import template from './weekdayCondition.template.html';
import controller from './weekdayCondition.controller';

export const name = 'iamConditionWeekday';

export default {
  bindings: {
    condition: '=ngModel',
    criterion: '<',
  },
  require: '^ngModel',
  template,
  controller,
};
