import controller from './move-ip.controller';
import template from './move-ip.html';

export default {
  bindings: {
    ips: '<',
    goBack: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
