import template from './dashboard.html';

export default {
  template,
  bindings: {
    bandwidthOption: '<',
    bandwidthVrackOption: '<',
    bandwidthVrackOrderOption: '<',
    orderPrivateLink: '<',
    orderPublicLink: '<',
    resiliatePrivateLink: '<',
    resiliatePublicLink: '<',
    server: '<',
    specifications: '<',
  },
};
