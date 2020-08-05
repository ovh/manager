import controller from './portabilities-attach.controller';
import template from './portabilities-attach.html';

export default {
  controller,
  template,
  bindings: {
    billingAccount: '<',
    portabilityId: '<',
    goBack: '<',
  },
};
