import template from './template.html';

export default {
  bindings: {
    server: '<',
    user: '<',
    goBack: '<',
    goToKvmOrder: '<',
    handleError: '<',
    handleSuccess: '<',
    trackingPrefix: '<',
  },
  template,
};
