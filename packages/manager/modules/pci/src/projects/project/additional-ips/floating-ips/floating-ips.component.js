import controller from './floating-ips.controller';
import template from './floating-ips.html';

export default {
  controller,
  template,
  bindings: {
    floatingIps: '<',
    goToAdditionalIpOrderPage: '<',
    goToEditInstance: '<',
    goToInstance: '<',
    goToTerminate: '<',
    projectId: '<',
    trackClick: '<',
  },
};
