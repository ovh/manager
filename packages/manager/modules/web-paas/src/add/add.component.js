import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    catalog: '<',
    getOrdersURL: '<',
    goBack: '<',
    plans: '<',
    selectedProject: '<',
    user: '<',
  },
  controller,
  template,
};
