import controller from './billing-renew-date.controller';
import template from './billing-renew-date.html';

export default {
  name: 'billingRenewDate',
  bindings: {
    serviceInfos: '<',
  },
  controller,
  template,
};
