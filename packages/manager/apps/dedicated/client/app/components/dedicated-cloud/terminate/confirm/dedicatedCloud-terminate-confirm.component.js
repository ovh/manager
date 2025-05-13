import controller from './dedicatedCloud-terminate-confirm.controller';
import template from './dedicatedCloud-terminate-confirm.html';

export default {
  bindings: {
    goBack: '<',
    productId: '<',
    token: '<',
  },
  controller,
  template,
};
