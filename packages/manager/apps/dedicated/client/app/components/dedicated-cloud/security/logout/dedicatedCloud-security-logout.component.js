import controller from './dedicatedCloud-security-logout.controller';
import template from './dedicatedCloud-security-logout.html';

export default {
  template,
  controller,
  bindings: {
    dedicatedCloud: '<',
    goBack: '<',
    productId: '<',
  },
  name: 'ovhManagerPccSecurityLogout',
};
