import controller from './federation-delete.controller';
import template from './federation-delete.html';

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
