import template from './terminate.html';
import controller from './terminate.controller';

export default {
  template,
  controller,
  bindings: {
    billingAccount: '<',
    serviceName: '<',
    isSvaWalletFeatureAvailable: '<',
    svaWalletLink: '<',
  },
};
