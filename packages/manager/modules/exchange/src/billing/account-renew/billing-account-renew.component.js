import controller from './billing-account-renew.controller';
import template from './billing-account-renew.template.html';

export default {
  bindings: {
    organization: '<',
    exchangeName: '<',
    onSuccess: '&',
    onError: '&',
  },
  controller,
  template,
};
