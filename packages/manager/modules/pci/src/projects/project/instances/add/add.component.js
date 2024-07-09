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
    projectId: '@',
    privateNetworks: '<',
    publicNetwork: '<',
    regions: '<',
    prices: '<',
    quotaLink: '<',
    regionsLink: '<',
    addPrivateNetworksLink: '<',
    addLocalPrivateNetworksLink: '<',
    getProductCatalog: '<',
    trackAddInstance: '<',
    hasGridscaleLocalzoneRegion: '<',
    isGridscaleLocalzoneAvailable: '<',
    customerRegions: '<',
    isDiscoveryProject: '<',
    projectActivationPageHref: '<',
  },
  controller,
  template,
};
