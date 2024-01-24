import controller from './activate.controller';
import template from './activate.html';

export default {
  bindings: {
    isTrustedZone: '<',
    projectId: '<',
    isDiscoveryProject: '<',
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
