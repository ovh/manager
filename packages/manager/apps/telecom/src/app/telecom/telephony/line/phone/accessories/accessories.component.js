import controller from './accessories.controller';
import template from './accessories.html';

export default {
  controller,
  template,
  bindings: {
    billingAccount: '<',
    serviceName: '<',
    goBack: '<',
    user: '<',
  },
};
