import controller from './change-offer.controller';
import template from './change-offer.html';

export default {
  bindings: {
    availableAddons: '<',
    catalog: '<',
    cpu: '<',
    goToDeleteUser: '<',
    getOrdersURL: '<',
    goBack: '<',
    plans: '<',
    projectId: '<',
    selectedProject: '<',
    user: '<',
  },
  controller,
  template,
};
