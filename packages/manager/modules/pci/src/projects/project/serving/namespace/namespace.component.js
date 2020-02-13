import controller from './namespace.controller';
import template from './namespace.html';

export default {
  controller,
  template,
  bindings: {
    namespace: '<',
    project: '<',
    namespaceLink: '<',
    deleteNamespace: '<',
    currentActiveLink: '<',
    infosLink: '<',
    modelsLink: '<',
    tokensLink: '<',
  },
};
