import controller from './add.controller';
import template from './add.html';

const component = {
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

export default component;
