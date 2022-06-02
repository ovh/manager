import controller from './public-gateways.controller';
import template from './public-gateways.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    publicGateways: '<',
    gateways: '<',
    projectId: '<',
    trackPublicGateways: '<',
    goToPublicGateway: '<',
    guideUrl: '<',
    goToDeleteGateway: '<',
    goToEditGateway: '<',
    goToPrivateNetwork: '<',
  },
  controller,
  template,
};
