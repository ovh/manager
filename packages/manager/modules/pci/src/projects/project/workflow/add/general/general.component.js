import template from './general.html';
import controller from './general.controller';

export default {
  bindings: {
    workflowName: '=?',
    price: '<',
  },
  template,
  controller,
};
