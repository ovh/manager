import controller from './infos.controller';
import template from './infos.html';

const component = {
  bindings: {
    namespace: '<',
    registry: '<',
    namespaceId: '<',
    goToContainer: '<',
    attachRegistry: '<',
    addModel: '<',
    listModels: '<',
    detachRegistry: '<',
    deleteNamespace: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
