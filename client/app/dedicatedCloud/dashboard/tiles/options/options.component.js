import controller from './options.controller';
import template from './options.html';

export default {
  bindings: {
    currentDrp: '<',
    currentService: '<',
    currentUser: '<',
  },
  controller,
  name: 'ovhManagerPccDashboardOptions',
  template,
};
