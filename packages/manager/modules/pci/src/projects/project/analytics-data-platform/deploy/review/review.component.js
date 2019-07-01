import controller from './review.controller';
import template from './review.html';

export default {
  template,
  controller,
  bindings: {
    analyticsDataPlatform: '<',
    deploymentInProgress: '<',
    nodesConfig: '<',
    price: '<',
    priceCatalog: '<',
    publicCloud: '<',
    selectedCapability: '<',
    selectedSshKey: '<',
    vRack: '<',
  },
};
