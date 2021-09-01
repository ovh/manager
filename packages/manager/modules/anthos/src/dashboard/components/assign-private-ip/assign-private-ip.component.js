import controller from './assign-private-ip.controller';
import template from './assign-private-ip.html';

export default {
  bindings: {
    serviceName: '<',
    goBack: '<',
    privateIPs: '<',
  },
  controller,
  template,
};
