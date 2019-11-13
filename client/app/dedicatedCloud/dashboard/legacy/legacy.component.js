import controller from './legacy.controller';
import template from './legacy.html';

export default {
  bindings: {
    currentDrp: '<',
    currentService: '<',
    currentUser: '<',
    datacenterList: '<',
  },
  controller,
  name: 'ovhManagerPccDashboardLegacy',
  template,
};
