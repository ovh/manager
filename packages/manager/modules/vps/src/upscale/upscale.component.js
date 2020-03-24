import controller from './upscale.controller';
import template from './upscale.html';

export default {
  bindings: {
    connectedUser: '<',
    defaultPaymentMethod: '<',
    getUpscaleInformation: '<',
    goToUpgradeSuccess: '<',
    performUpscale: '<',
    scrollToTop: '<',
    upscaleOptions: '<',
    vps: '<stateVps',

    goBack: '<',
    goToSuccessUpgradeModal: '<',
  },
  controller,
  name: 'vpsUpscale',
  template,
};
