import controller from './delete.controller';
import template from './delete.html';

export default {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    modelId: '<',
    projectId: '<',
  },
  template,
  controller,
};
