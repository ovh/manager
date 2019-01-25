import controller from './billing-account-billing-credit-threshold.controller';
import template from './billing-account-billing-credit-threshold.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.creditThreshold', {
    url: '/creditThreshold',
    views: {
      '@telephony': {
        template,
        controller,
        controllerAs: 'BillingAccountCreditThresholdCtrl',
      },
    },
    translations: ['.', '..'],
  });
};
