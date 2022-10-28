import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    pciFeatures: '<',
    isTrustedZone: '<',
    catalogEndpoint: '<',
    addInstanceSuccessMessage: '<',
    addInstancesSuccessMessage: '<',
    disablePrivateNetworks: '<',
    excludeCategories: '<?',
    goBack: '<',
    includeCategories: '<?',
    offer: '<',
    projectId: '@',
    privateNetworks: '<',
    publicNetwork: '<',
    regions: '<',
    prices: '<',
    quotaLink: '<',
    regionsLink: '<',
    addPrivateNetworksLink: '<',
    selectedCategory: '@?',
    getProductCatalog: '<',
    trackAddInstance: '<',
  },
  controller,
  template,
};
