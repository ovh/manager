import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    goBack: '<',
    privateIPs: '<',
    trackingPrefix: '<',
    trackClick: '<',
    trackPage: '<',
    assignPrivateIpHitTracking: '<',
  },
  controller,
  template,
};
