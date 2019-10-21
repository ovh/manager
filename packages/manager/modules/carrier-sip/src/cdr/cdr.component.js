import controller from './cdr.controller';
import template from './cdr.html';

export default {
  bindings: {
    billingAccount: '<',
    serviceName: '<',
  },
  controller,
  template,
};
