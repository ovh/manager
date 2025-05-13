import template from './service-management.html';

export default {
  bindings: {
    currentService: '<',
    currentUser: '<',
    showMailingList: '<',
    onMlSubscribe: '&',
    onTerminate: '&',
  },
  name: 'ovhManagerPccDashboardServiceManagement',
  template,
};
