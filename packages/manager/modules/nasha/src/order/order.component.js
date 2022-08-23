import controller from './order.controller';
import template from './order.template.html';

export default {
  bindings: {
    goToNasha: '<',
    plans: '<',
    trackClick: '<',
    trackClickConfirmOrder: '<',
  },
  controller,
  template,
};
