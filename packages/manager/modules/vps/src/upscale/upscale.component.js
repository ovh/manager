import controller from './upscale.controller';
import template from './upscale.html';

export default {
  bindings: {
    agreements: '<',
    catalog: '<',
    connectedUser: '<',
    defaultPaymentMethod: '<',
    getUpscaleInformation: '<',
    getRebootLink: '<',
    performUpscale: '<',
    scrollToTop: '<',
    upscaleOptions: '<',
    pricingRenewPeriod: '<',
    vps: '<stateVps',
    goBack: '<',
  },
  controller,
  name: 'vpsUpscale',
  template,
};
