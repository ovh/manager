import controller from './detach.controller';
import template from './detach.html';

export default {
  bindings: {
    goBack: '<',
    projectId: '<',
    deleteRegistry: '<',
  },
  template,
  controller,
};
