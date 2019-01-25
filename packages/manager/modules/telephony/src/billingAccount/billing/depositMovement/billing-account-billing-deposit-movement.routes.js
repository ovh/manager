import controller from './billing-account-billing-deposit-movement.controller';
import template from './billing-account-billing-deposit-movement.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.depositMovement', {
    url: '/depositMovement',
    views: {
      '@telephony': {
        template,
        controller,
        controllerAs: 'BillingAccountDepositMovementCtrl',
      },
    },
    translations: ['.', '..'],
  });
};
