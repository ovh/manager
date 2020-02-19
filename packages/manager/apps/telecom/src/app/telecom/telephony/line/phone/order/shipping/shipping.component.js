import controller from './shipping.controller';
import template from './shipping.html';

export default {
  controller,
  template,
  bindings: {
    order: '<',
    isStepLoading: '<',
  },
};
