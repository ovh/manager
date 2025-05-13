import controller from './attach.controller';
import template from './attach.html';

export default {
  controller,
  template,
  bindings: {
    billingAccount: '<',
    portabilityId: '<',
    goBack: '<',
  },
};
