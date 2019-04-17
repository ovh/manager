import controller from './list.controller';
import template from './list.html';

export default {
  bindings: {
    projectId: '<',
    createNetwork: '<',
    deleteNetwork: '<',
  },
  controller,
  template,
};
