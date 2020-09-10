import controller from './dedicatedCloud-security-update.controller';
import template from './dedicatedCloud-security-update.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    policy: '<',
    productId: '<',
  },
  name: 'ovhManagerPccSecurityUpdate',
};
