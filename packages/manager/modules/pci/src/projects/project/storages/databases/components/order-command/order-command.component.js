import controller from './order-command.controller';
import template from './order-command.html';

export default {
  bindings: {
    engine: '<',
    orderData: '<',
    projectId: '<',
    user: '<',
  },
  controller,
  template,
};
