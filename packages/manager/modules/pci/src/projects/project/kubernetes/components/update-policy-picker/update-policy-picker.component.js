import controller from './update-policy-picker.controller';
import template from './update-policy-picker.template.html';

export default {
  bindings: {
    updatePolicy: '=',
    updatePolicies: '<',
    frozen: '<',
    documentation: '<',
  },
  controller,
  template,
};
