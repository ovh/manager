import controller from './order-review.controller';
import template from './order-review.html';

export default {
  bindings: {
    engine: '<',
    flavor: '<',
    plan: '<',
    user: '<',
    version: '<',
  },
  controller,
  template,
};
