import controller from './dedicatedCloud-security-session-timeout-update.controller';
import template from './dedicatedCloud-security-session-timeout-update.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    productId: '<',
    userSessionTimeout: '<',
  },
  name: 'ovhManagerPccSecuritySessionTimeoutUpdate',
};
