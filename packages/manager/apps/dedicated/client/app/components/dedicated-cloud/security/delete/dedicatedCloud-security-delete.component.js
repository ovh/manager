import controller from './dedicatedCloud-security-delete.controller';
import template from './dedicatedCloud-security-delete.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    policies: '<',
    productId: '<',
    selectedPolicies: '<',
  },
  name: 'ovhManagerPccSecurityDelete',
};
