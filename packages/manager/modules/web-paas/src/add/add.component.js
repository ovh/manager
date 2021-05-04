import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    addons: '<',
    catalog: '<',
    getOrdersURL: '<',
    goBack: '<',
    plans: '<',
    user: '<',
    selectedProject: '<',
  },
  controller,
  template,
};
