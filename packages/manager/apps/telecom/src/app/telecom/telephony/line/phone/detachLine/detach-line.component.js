import controller from './detach-line.controller';
import template from './detach-line.html';

export default {
  bindings: {
    billingAccount: '<',
    serviceName: '<',
    goBack: '<',
  },
  controller,
  template,
};
