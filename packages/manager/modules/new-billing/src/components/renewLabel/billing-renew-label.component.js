import controller from './billing-renew-label.controller';
import template from './billing-renew-label.html';

export default {
  name: 'billingRenewLabel',
  bindings: {
    serviceInfos: '<',
  },
  controller,
  template,
};
