import controller from './details.controller';
import template from './details.html';

export default {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    namespace: '<',
    goToContainer: '<',
    projectId: '<',
  },
  template,
  controller,
};
