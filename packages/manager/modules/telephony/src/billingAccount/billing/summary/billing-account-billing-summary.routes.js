import controller from './billing-account-billing-summary.controller';
import template from './billing-account-billing-summary.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.billing.summary', {
    url: '/summary',
    views: {
      '@telephony': {
        template,
        controller,
        controllerAs: 'SummaryCtrl',
      },
    },
    translations: ['.', '..'],
  });
};
