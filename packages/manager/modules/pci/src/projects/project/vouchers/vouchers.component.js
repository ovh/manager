import controller from './vouchers.controller';
import template from './vouchers.html';

export default {
  bindings: {
    deals: '<',
    guideUrl: '<',
  },
  controller,
  template,
};
