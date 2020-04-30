import controller from './server.controller';
import template from './server.html';

export const component = {
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

angular.module('App').component('dedicatedServer', component);

export default component;
