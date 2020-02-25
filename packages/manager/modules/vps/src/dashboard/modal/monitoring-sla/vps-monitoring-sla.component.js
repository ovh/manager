import controller from './vps-monitoring-sla.controller';
import template from './vps-monitoring-sla.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    preview: '<',
    state: '<',
  },
  controller,
  template,
};
