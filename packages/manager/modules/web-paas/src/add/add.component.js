import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    getOrdersURL: '<',
    goBack: '<',
    catalog: '<',
    user: '<',
    plans: '<',
  },
  controller,
  template,
};
