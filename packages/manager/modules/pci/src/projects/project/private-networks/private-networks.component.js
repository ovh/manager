import controller from './private-networks.controller';
import template from './private-networks.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    createNetwork: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    privateNetworks: '<',
    localPrivateNetworks: '<',
    projectId: '<',
    networkId: '<',
    onListParamChange: '<',
    getStateName: '<',
    steins: '<',
    customerRegions: '<',
    privateNetworksRegions: '<',
    goToRegion: '<',
    goToAddPublicGateway: '<',
    gateways: '<',
    gatewaysLink: '<',
    globalRegionsLink: '<',
    localZoneLink: '<',
    currentActiveLink: '<',
    hasGridscaleLocalzoneRegion: '<',
  },
  controller,
  template,
};
