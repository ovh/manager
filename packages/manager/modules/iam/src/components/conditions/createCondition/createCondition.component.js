import controller from './createCondition.controller';
import template from './createCondition.template.html';

export const name = 'iamCreateCondition';

export default {
  bindings: {
    conditions: '=ngModel',
  },
  require: '^ngModel',
  controller,
  template,
};
