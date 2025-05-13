import controller from './vsphere-user-iam-role.controller';
import template from './vsphere-user-iam-role.html';

export default {
  bindings: {
    goBack: '<',
    productId: '<',
    trackClick: '<',
    trackPage: '<',
    goBackWithTrackingPage: '<',
  },
  controller,
  template,
};
