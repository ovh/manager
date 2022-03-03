import controller from './edit.controller';
import template from './edit.html';

export default {
  template,
  controller,
  bindings: {
    catalogEndpoint: '<',
    excludeCategories: '<',
    goBack: '<',
    imageEditMessage: '<',
    imageEditSuccessMessage: '<',
    instance: '<',
    instanceId: '<',
    pciFeatures: '<',
    projectId: '<',
    region: '<',
  },
};
