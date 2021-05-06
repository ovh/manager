import controller from './modify-plan.controller';
import template from './modify-plan.html';

export default {
  bindings: {
    catalog: '<',
    cpu: '<',
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
