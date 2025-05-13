import controller from './iam-toggle.controller';
import template from './iam-toggle.html';

export default {
  bindings: {
    goBack: '<',
    productId: '<',
    trackClick: '<',
    trackPage: '<',
    iamToggleState: '<',
  },
  controller,
  template,
};
