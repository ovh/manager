import template from './dashboard.html';

export default {
  bindings: {
    currentService: '<',
    currentUser: '<',
  },
  name: 'ovhManagerPccDashboard',
  template,
};
