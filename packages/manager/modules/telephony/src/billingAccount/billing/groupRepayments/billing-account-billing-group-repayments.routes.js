import controller from './billing-account-billing-group-repayments.controller';
import template from './billing-account-billing-group-repayments.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.billing.groupRepayments', {
    url: '/groupRepayments',
    views: {
      '@telephony': {
        template,
        controller,
        controllerAs: 'GroupRepaymentsCtrl',
      },
    },
    translations: ['.'],
  });
};
