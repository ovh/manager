import controller from './input-rule.controller';
import template from './input-rule.html';

export default {
  bindings: {
    valid: '<',
    label: '@',
  },
  controller,
  template,
};
