import controller from './serving.controller';
import template from './serving.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    namespaces: '<',
    addNamespaceLink: '<',
    namespaceLink: '<',
    viewNamespace: '<',
    deleteNamespace: '<',
  },
};
