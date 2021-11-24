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
    excludeCategories: '<',
    imageEditMessage: '<',
    imageEditSuccessMessage: '<',
    goBack: '<',
  },
};
