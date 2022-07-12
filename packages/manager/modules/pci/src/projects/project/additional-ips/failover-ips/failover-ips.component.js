import controller from './failover-ips.controller';
import template from './failover-ips.html';

export default {
  controller,
  template,
  bindings: {
    failoverIps: '<',
    goToAdditionalIpOrderPage: '<',
    goToEditInstance: '<',
    goToInstance: '<',
    goToImportFailoverIps: '<',
    goToTerminate: '<',
    projectId: '<',
  },
};
