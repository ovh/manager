import controller from './infos.controller';
import template from './infos.html';

export default {
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
