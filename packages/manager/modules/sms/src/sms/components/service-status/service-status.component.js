import controller from './service-status.controller';
import template from './service-status.html';

export default {
  bindings: {
    serviceName: '<',
    loading: '<',
    isSmppAccount: '<',
    status: '<',
    trackingPrefix: '<',
  },
  controller,
  name: 'ovhManagerSmsServiceStatus',
  template,
};
