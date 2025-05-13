import controller from './carousel.controller';
import template from './carousel.html';

export default {
  bindings: {
    trackingPrefix: '@',
    productType: '<',
    items: '<',
  },
  controller,
  template,
};
