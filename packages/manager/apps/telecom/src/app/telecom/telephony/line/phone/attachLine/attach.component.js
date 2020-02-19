import controller from './attach.controller';
import template from './attach.html';

export default {
  bindings: {
    billingAccount: '<',
    serviceName: '<',
    goBack: '<',
  },
  controller,
  template,
};
