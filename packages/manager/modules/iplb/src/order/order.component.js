import controller from './order.controller';
import template from './order.html';

export default {
  bindings: {
    setupIpLb: '<',
    ipLbPublicUrl: '<',
  },
  controller,
  template,
};
