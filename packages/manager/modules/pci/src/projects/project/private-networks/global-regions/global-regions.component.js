import controller from './global-regions.controller';
import template from './global-regions.html';

export default {
  controller,
  template,
  bindings: {
    createNetwork: '<',
    gotoDeleteSubnet: '<',
    trackClick: '<',
    privateNetworks: '<',
    projectId: '<',
    networkId: '<',
    onListParamChange: '<',
    goToAddPublicGateway: '<',
    gateways: '<',
    gatewaysLink: '<',
  },
};
