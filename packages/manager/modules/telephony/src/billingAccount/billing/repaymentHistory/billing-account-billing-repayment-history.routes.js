import controller from './billing-account-billing-repayment-history.controller';
import template from './billing-account-billing-repayment-history.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.billing.repayment-history', {
    url: '/repayment-history',
    views: {
      '@telephony': {
        template,
        controller,
        controllerAs: 'RepaymentHistoryCtrl',
      },
    },
    translations: ['.'],
  });
};
