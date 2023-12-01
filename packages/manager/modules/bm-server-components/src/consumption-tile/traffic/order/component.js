import controller from './traffic-order.controller';
import template from './traffic-order.template.html';

export default {
  bindings: {
    server: '<',
    goBack: '<',
  },
  controller,
  template,
};
