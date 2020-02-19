import controller from './update.controller';
import template from './update.html';

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
