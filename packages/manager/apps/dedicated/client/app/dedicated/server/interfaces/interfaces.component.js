import template from './interfaces.html';
import controller from './interfaces.controller';

export default {
  template,
  controller,
  bindings: {
    bandwidthOption: '<',
    bandwidthVrackOption: '<',
    bandwidthVrackOrderOptions: '<',
    failoverIps: '<',
    guideUrl: '<',
    interfaces: '<',
    ola: '<',
    optionPrice: '<',
    orderPrivateBandwidthLink: '<',
    orderPublicBandwidthLink: '<',
    server: '<',
    serverName: '<',
    specifications: '<',
    resiliatePublicBandwidthLink: '<',
    resiliatePrivateBandwidthLink: '<',
    taskPolling: '<',
    urls: '<',
    user: '<',
    vrack: '<',
  },
};
