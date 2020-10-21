import controller from './billing-autoRenew-delete.controller';
import template from './billing-autoRenew-delete.html';

export default {
  bindings: {
    cancelResiliationUrl: '<',
    engagement: '<',
    goBack: '<',
    service: '<',
    supportPhoneNumber: '<',
    updateService: '<',
  },
  controller,
  template,
};
