import template from './productTypeCondition.template.html';
import controller from './productTypeCondition.controller';

export const name = 'iamConditionProductType';

export default {
  bindings: {
    condition: '=ngModel',
    criterion: '<',
  },
  require: '^ngModel',
  template,
  controller,
};
