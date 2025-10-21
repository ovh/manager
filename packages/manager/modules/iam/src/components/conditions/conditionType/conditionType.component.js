import template from './conditionType.template.html';
import controller from './conditionType.controller';

export const name = 'iamConditionType';

export default {
  bindings: {
    condition: '=',
    conditionType: '<',
    criterion: '<',
  },
  template,
  controller,
};
