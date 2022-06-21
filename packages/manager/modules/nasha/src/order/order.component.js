import controller from './order.controller';
import template from './order.template.html';

export default {
  bindings: {
    cancelLink: '<',
    plans: '<',
  },
  controller,
  template,
};
