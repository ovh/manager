import controller from './remove-private-ip.controller';
import template from './remove-private-ip.html';

export default {
  bindings: {
    serviceName: '<',
    goBack: '<',
    privateIPs: '<',
    privateIp: '<',
    trackClick: '<',
    trackPage: '<',
    removePrivateIpHitTracking: '<',
  },
  controller,
  template,
};
