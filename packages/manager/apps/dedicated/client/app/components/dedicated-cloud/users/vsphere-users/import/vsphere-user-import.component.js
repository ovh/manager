import controller from './vsphere-user-import.controller';
import template from './vsphere-user-import.html';

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
