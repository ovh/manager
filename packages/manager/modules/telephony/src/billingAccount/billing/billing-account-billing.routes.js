import controller from './billing-account-billing.controller';
import template from './billing-account-billing.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.billing', {
    url: '/billing',
    template,
    controller,
    controllerAs: 'GroupBillingCtrl',
    translations: ['.'],
  });
};
