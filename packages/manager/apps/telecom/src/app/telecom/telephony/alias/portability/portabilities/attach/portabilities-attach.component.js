import controller from './portabilities-attach.controller';
import template from './portabilities-attach.html';

export default {
  bindings: {
    billingAccount: '<',
    portabilityId: '<',
    goBack: '<',
  },
  controller,
  template,
};
