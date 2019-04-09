import template from './default.html';
import controller from './default.controller';

export default {
  template,
  controller,
  bindings: {
    defaultPaymentMethod: '<',
  },
};
