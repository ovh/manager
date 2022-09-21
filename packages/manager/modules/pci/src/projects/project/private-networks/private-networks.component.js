import controller from './private-networks.controller';
import template from './private-networks.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    createNetwork: '<',
    deleteSubnet: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    privateNetworks: '<',
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
  },
  controller,
  template,
};
