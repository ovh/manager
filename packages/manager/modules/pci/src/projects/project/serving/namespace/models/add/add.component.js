import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    namespace: '<',
    presetImages: '<',
    flavors: '<',
    goToContainer: '<',
    projectId: '<',
  },
  template,
  controller,
};
