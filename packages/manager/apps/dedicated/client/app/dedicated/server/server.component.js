import controller from './server.controller';
import template from './server.html';

export default {
  bindings: {
    ola: '<',
    orderPrivateBandwidthLink: '<',
    orderPublicBandwidthLink: '<',
    resiliatePrivateBandwidthLink: '<',
    resiliatePublicBandwidthLink: '<',
    server: '<',
    specifications: '<',
  },
  controller,
  template,
};
