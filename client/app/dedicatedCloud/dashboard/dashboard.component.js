import template from './dashboard.html';

export default {
  bindings: {
    currentDrp: '<',
    currentService: '<',
    currentUser: '<',
    datacenterList: '<',
  },
  name: 'ovhManagerPccDashboard',
  template,
};
