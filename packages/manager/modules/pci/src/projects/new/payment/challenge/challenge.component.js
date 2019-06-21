import controller from './challenge.controller';
import template from './challenge.html';

export default {
  controller,
  template,
  bindings: {
    defaultPaymentMethod: '<',
    getStateLink: '<',
  },
};
