import controller from './edit.controller';
import template from './edit.html';

export default {
  template,
  controller,
  bindings: {
    catalogEndpoint: '<',
    excludeCategories: '<',
    goBack: '<',
    imageEditSuccessMessage: '<',
    instance: '<',
    hasComingSoonFlavorTag: '<',
    instanceId: '<',
    pciFeatures: '<',
    projectId: '<',
    region: '<',
    catalog: '<',
    customerRegions: '<',
    imageInformation: '<',
    getUAppUrl: '<',
  },
};
