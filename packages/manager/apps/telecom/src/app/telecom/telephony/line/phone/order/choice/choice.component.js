import template from './choice.html';
import controller from './choice.controller';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
    billingAccount: '<',
    line: '<',
    isStepLoading: '<',
    phone: '<',
  },
};
