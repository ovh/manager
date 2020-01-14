import controller from './iplb-server-farm-probe.controller';
import template from './iplb-server-farm-probe.html';

export default {
  bindings: {
    availableProbes: '<',
    edition: '<',
    farm: '<',
    goBackToEditPage: '<',
    serviceName: '<',
  },
  controller,
  template,
};
