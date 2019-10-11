import template from './service-management.html';

export default {
  bindings: {
    currentService: '<',
    currentUser: '<',
  },
  name: 'ovhManagerPccDashboardServiceManagement',
  template,
};
