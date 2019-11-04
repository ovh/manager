import controller from './vps-dashboard.controller';
import template from './vps-dashboard.html';

export default {
  bindings: {
    features: '<',
    serviceName: '<',
    stateVps: '<',
  },
  controller,
  name: 'ovhManagerVpsDashboard',
  template,
};
