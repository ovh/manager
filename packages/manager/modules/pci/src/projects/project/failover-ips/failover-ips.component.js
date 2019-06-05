import controller from './failover-ips.controller';
import template from './failover-ips.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    failoverIps: '<',
    instances: '<',
  },
};
