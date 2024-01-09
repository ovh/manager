import template from './nsxt.html';
import controller from './nsxt.controller';

export default {
  bindings: {
    currentService: '<',
    goToDatacenter: '<',
  },
  name: 'ovhManagerPccDashboardOptionsNsxt',
  template,
  controller,
};
