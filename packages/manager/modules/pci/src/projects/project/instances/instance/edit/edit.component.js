import controller from './edit.controller';
import template from './edit.html';

export default {
  template,
  controller,
  bindings: {
    pciFeatures: '<',
    projectId: '<',
    instanceId: '<',
    instance: '<',
    region: '<',
    catalogEndpoint: '<',
    excludeCategories: '<',
    imageEditMessage: '<',
    imageEditSuccessMessage: '<',
    goBack: '<',
  },
};
