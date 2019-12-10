import controller from './detach.controller';
import template from './detach.html';

export default {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    projectId: '<',
  },
  template,
  controller,
};
