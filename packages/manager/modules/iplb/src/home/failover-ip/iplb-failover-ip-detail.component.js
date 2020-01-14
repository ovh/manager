import controller from './iplb-failover-ip-detail.controller';
import template from './iplb-failover-ip-detail.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
