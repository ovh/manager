import template from './order-alias-main.html';
import controller from './order-alias.controller';

export default {
  controller,
  template,
  bindings: {
    isSvaWalletFeatureAvailable: '<',
    isSvaWalletValid: '<',
    goToSvaWallet: '<',
  },
};
