import controller from './change-offer.controller';
import template from './change-offer.html';

export default {
  bindings: {
    catalog: '<',
    cpu: '<',
    deleteUser: '<',
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
