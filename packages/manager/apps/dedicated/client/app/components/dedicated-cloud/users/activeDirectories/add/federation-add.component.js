import controller from './federation-add.controller';
import template from './federation-add.html';

export default {
  bindings: {
    goBack: '<',
    productId: '<',
    user: '<',
  },
  controller,
  template,
};
