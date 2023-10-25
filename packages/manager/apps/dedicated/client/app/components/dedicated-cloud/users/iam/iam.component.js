import controller from './iam.controller';
import template from './iam.html';

export default {
  bindings: {
    dedicatedCloud: '<',
    productId: '<',
    goToToggleIam: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
