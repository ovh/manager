import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    goBack: '<',
    privateIPs: '<',
    trackingPrefix: '<',
    trackClick: '<',
    assignPrivateIpHitTracking: '<',
  },
  controller,
  template,
};
