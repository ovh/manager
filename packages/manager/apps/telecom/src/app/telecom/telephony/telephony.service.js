import controller from './telephony.controller';
import template from './telephony.html';

export default {
  controller,
  template,
  bindings: {
    getBillingAccountLink: '<',
  },
};
