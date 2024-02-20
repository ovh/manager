import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    projectId: '<',
    guideUrl: '<',
    regions: '<',
    displayAddPrivateNetworkModal: '<',
    goToPublicGateway: '<',
    goBack: '<',
    trackPublicGateways: '<',
    defaults: '<',
    goToPrivateNetwork: '<',
    onGoBackClick: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    regionsLink: '<',
    isDiscoveryProject: '<',
    goToDiscoveryProjectActivationPage: '&',
  },
  controller,
  template,
};
