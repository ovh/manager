import template from './private-config-funnel.html';
import controller from './private-config-funnel.controller';

export default {
  template,
  controller,
  bindings: {
    exchange: '<',
    goToDashboard: '<',
    organization: '<',
    productId: '<',
  },
};
