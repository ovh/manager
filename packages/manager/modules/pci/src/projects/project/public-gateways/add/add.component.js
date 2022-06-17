import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    projectId: '<',
    guideUrl: '<',
    regions: '<',
    displayAddPrivateNetworkModal: '<',
    gatewayCatalog: '<',
    goToPublicGateway: '<',
    goBack: '<',
    trackPublicGateways: '<',
  },
  controller,
  template,
};
