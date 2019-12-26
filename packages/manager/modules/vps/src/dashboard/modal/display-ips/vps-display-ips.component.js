import controller from './vps-display-ips.controller';
import template from './vps-display-ips.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
