import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    nodeId: '<',
    user: '<',
  },
  controller,
  template,
};
