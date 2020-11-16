import controller from './dedicatedCloud-security-access.controller';
import template from './dedicatedCloud-security-access.html';

export default {
  template,
  controller,
  bindings: {
    dedicatedCloud: '<',
    goBack: '<',
    productId: '<',
  },
  name: 'ovhManagerPccSecurityAccess',
};
