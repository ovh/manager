import controller from './order.controller';
import template from './order.html';

export default {
  controller,
  template,
  bindings: {
    instances: '<',
    projectId: '<',
    goBack: '<',
    regions: '<',
  },
};
