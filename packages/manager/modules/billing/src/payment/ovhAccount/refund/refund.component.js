import controller from './refund.controller';
import template from './template.html';

export default {
  bindings: {
    goBack: '<',
    movement: '<',
    requestRefund: '<',
  },
  controller,
  template,
};
