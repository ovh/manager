import template from './dashboard.html';

export default {
  template,
  bindings: {
    displayPublicBandwidth: '<',
    bandwidthOption: '<',
    bandwidthVrackOption: '<',
    bandwidthVrackOrderOption: '<',
    orderPrivateLink: '<',
    orderPublicLink: '<',
    resiliatePrivateLink: '<',
    resiliatePublicLink: '<',
    server: '<',
    specifications: '<',
    isOldCluster: '<',
  },
};
