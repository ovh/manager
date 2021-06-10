import controller from './add.controller';
import template from './template.html';

export default {
  bindings: {
    addons: '<',
    catalog: '<',
    cpu: '<',
    getOrdersURL: '<',
    goBack: '<',
    plans: '<',
    projectId: '<',
    user: '<',
    selectedProject: '<',
  },
  controller,
  template,
};
