import controller from './cancel.controller';
import template from './cancel.html';

export default {
  controller,
  template,
  bindings: {
    billingAccount: '<',
    portabilityId: '<',
    goBack: '<',
  },
};
