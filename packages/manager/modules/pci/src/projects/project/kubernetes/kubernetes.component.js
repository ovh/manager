import controller from './kubernetes.controller';
import template from './kubernetes.html';

export default {
  bindings: {
    projectId: '@',
  },
  controller,
  template,
};
