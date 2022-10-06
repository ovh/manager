import controller from './federation-edit.controller';
import template from './federation-edit.html';

export default {
  bindings: {
    goBack: '<',
    productId: '<',
    activeDirectory: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
