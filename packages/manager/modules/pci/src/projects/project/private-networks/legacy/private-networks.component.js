import controller from './private-networks.controller';
import template from './private-networks.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    createNetwork: '<',
    deleteNetwork: '<',
    guideUrl: '<',
    privateNetworks: '<',
    projectId: '<',
    networkId: '<',
    onListParamChange: '<',
    getStateName: '<',
    steins: '<',
    customerRegions: '<',
    privateNetworksRegions: '<',
    goToRegion: '<',
  },
  controller,
  template,
};
