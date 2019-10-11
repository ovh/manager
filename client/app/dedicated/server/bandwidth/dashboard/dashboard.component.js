import controller from './dashboard.controller';
import template from './dashboard.html';

export default {
  controller,
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
