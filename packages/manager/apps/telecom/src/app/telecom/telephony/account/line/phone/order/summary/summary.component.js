import controller from './summary.controller';
import template from './summary.html';

export default {
  controller,
  template,
  bindings: {
    isStepLoading: '<',
    order: '<',
    phone: '<',
  },
};
