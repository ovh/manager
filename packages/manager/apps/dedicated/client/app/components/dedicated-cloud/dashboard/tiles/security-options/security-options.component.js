import controller from './security-options.controller';
import template from './security-options.html';

export default {
  bindings: {
    orderSecurityOption: '<',
    productId: '<',
    setMessage: '<',
  },
  name: 'ovhManagerPccDashboardSecurityOptions',
  controller,
  template,
};
