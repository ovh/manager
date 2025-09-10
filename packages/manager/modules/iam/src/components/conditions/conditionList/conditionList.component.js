import controller from './conditionList.controller';
import template from './conditionList.template.html';

export const name = 'iamConditionList';

export default {
  bindings: {
    conditions: '=',
    readOnly: '<',
  },
  controller,
  template,
};
