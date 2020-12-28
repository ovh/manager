import controller from './upscale.controller';
import template from './upscale.html';

export default {
  bindings: {
    agreements: '<',
    catalog: '<',
    connectedUser: '<',
    defaultPaymentMethod: '<',
    getUpscaleInformation: '<',
    performUpscale: '<',
    scrollToTop: '<',
    upscaleOptions: '<',
    vps: '<stateVps',

    goBack: '<',
  },
  controller,
  name: 'vpsUpscale',
  template,
};
