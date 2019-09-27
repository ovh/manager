import template from './serviceManagement.html';

export default {
  bindings: {
    currentService: '<',
    currentUser: '<',
  },
  name: 'ovhManagerPccDashboardServiceManagement',
  template,
};
