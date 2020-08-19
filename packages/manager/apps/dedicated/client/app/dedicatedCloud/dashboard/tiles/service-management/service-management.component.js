import template from './service-management.html';

export default {
  bindings: {
    currentService: '<',
    currentUser: '<',
    showMailingList: '<',
  },
  name: 'ovhManagerPccDashboardServiceManagement',
  template,
};
