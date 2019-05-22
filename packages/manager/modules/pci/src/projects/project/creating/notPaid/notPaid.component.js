import controller from './notPaid.controller';
import template from './notPaid.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    projectOrder: '<',
  },
};
