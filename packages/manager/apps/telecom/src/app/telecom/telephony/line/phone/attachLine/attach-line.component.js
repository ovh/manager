import controller from './attach-line.controller';
import template from './attach-line.html';

export default {
  bindings: {
    billingAccount: '<',
    serviceName: '<',
    goBack: '<',
  },
  controller,
  template,
};
