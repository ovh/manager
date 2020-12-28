import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    namespace: '<',
    presetImages: '<',
    flavors: '<',
    features: '<',
    frameworks: '<',
    backends: '<',
    user: '<',
    pricesCatalog: '<',
    goToContainer: '<',
    projectId: '<',
  },
  template,
  controller,
};
