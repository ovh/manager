import template from './deactivate-logs.html';
import controller from './deactivate-logs.controller';

export default {
  controller,
  bindings: {
    productId: '<',
    goBack: '<',
    onDeactivateLogs: '&',
  },
  name: 'ovhManagerPccDeactivateLogs',
  template,
};
