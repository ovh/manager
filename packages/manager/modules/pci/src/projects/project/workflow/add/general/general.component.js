import controller from './general.controller';
import template from './general.html';

export default {
  bindings: {
    price: '<',
    workflowName: '=?',
  },
  controller,
  template,
};
