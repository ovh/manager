import controller from './telecom-telephony-alias-portability-portabilities.controller';
import template from './telecom-telephony-alias-portability-portabilities.html';

export default {
  bindings: {
    billingAccount: '<',
    portabilityId: '<',
    attachMandate: '<',
  },
  controller,
  template,
};
