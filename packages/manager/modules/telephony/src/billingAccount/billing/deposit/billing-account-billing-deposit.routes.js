import controller from './billing-account-billing-deposit.controller';
import template from './billing-account-billing-deposit.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.billing.deposit', {
    url: '/deposit',
    views: {
      '@telephony': {
        template,
        controller,
        controllerAs: 'BillingDepositCtrl',
      },
    },
    translations: ['.'],
  });
};
