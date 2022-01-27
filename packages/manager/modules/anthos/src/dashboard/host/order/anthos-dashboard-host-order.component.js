import template from './anthos-dashboard-host-order.html';
import controller from './anthos-dashboard-host-order.controller';

export default {
  bindings: {
    availableOptions: '<',
    displayAlerterMessage: '<',
    goBack: '<',
    hostLink: '<',
    serviceName: '<',
    trackClick: '<',
  },
  template,
  controller,
};
