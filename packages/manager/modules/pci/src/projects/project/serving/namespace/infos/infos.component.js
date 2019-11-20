import controller from './infos.controller';
import template from './infos.html';

const component = {
  bindings: {
    namespace: '<',
    registry: '<',
    namespaceId: '<',
    goToContainer: '<',
    attachRegistry: '<',
    detachRegistry: '<',
    deleteNamespace: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
