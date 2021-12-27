import template from './anthos-dashboard-host-order.html';
import controller from './anthos-dashboard-host-order.controller';

export default {
  bindings: {
    displayAlerterMessage: '<',
    goBack: '<',
    hostLink: '<',
    serviceName: '<',
  },
  template,
  controller,
};
