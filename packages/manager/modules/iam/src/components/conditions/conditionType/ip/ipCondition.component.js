import template from './ipCondition.template.html';
import controller from './ipCondition.controller';

export const name = 'iamConditionIp';

export default {
  bindings: {
    condition: '=ngModel',
    criterion: '<',
  },
  require: '^ngModel',
  template,
  controller,
};
