import controller from './legacy.controller';
import template from './legacy.html';

export default {
  bindings: {
    currentService: '<',
    currentUser: '<',
  },
  controller,
  name: 'ovhManagerPccDashboardLegacy',
  template,
};
