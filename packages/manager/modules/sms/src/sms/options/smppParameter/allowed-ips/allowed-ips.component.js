import controller from './allowed-ips.controller';
import template from './allowed-ips.html';

export default {
  bindings: {
    serviceName: '<',
    checkStatus: '&',
    status: '=',
  },
  controller,
  template,
};
