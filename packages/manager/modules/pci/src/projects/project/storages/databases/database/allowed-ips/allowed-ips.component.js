import template from './allowed-ips.html';
import controller from './allowed-ips.controller';

export default {
  bindings: {
    allowedIps: '<',
    goToAddIp: '<',
    goToDeleteIpBlock: '<',
    goToUpdateIp: '<',
    trackDatabases: '<',
  },
  controller,
  template,
};
