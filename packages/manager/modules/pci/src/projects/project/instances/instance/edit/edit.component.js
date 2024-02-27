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
    hasComingSoonFlavorTag: '<',
    instanceId: '<',
    pciFeatures: '<',
    projectId: '<',
    region: '<',
    catalog: '<',
    customerRegions: '<',
    imageInformation: '<',
    hourlyPriceInformation: '<',
  },
};
