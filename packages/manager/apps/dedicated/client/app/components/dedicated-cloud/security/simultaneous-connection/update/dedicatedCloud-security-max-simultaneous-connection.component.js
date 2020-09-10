import controller from './dedicatedCloud-security-max-simultaneous-connection.controller';
import template from './dedicatedCloud-security-max-simultaneous-connection.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    productId: '<',
    userLimitConcurrentSession: '<',
  },
  name: 'ovhManagerPccSecuritySimultaneousConnectionUpdate',
};
