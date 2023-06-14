import template from './nsxt.html';
import controller from './nsxt.controller';

export default {
  bindings: {
    currentService: '<',
  },
  name: 'ovhManagerPccDashboardOptionsNsxt',
  template,
  controller,
};
