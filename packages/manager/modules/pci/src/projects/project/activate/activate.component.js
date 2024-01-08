import controller from './activate.controller';
import template from './activate.html';

export default {
  bindings: {
    isTrustedZone: '<',
    projectId: '<',
    serviceId: '<',
    discoveryPromotionVoucherAmount: '@',
    activationVoucherCode: '@',
    voucherAmount: '@',
    activateProject: '<',
    goToLoadingUpgradePage: '<',
    claimDiscoveryVoucher: '<',
  },
  controller,
  template,
};
