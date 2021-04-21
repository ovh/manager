import controller from './add.controller';
import template from './template.html';

export default {
  bindings: {
    catalog: '<',
    cpu: '<',
    getOrdersURL: '<',
    goBack: '<',
    plans: '<',
    projectId: '<',
    user: '<',
  },
  controller,
  template,
};
