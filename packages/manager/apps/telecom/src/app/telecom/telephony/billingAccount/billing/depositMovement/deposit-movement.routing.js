import template from './deposit-movement.html';
import controller from './deposit-movement.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.depositMovement', {
    url: '/depositMovement',
    views: {
      'groupView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'BillingAccountDepositMovementCtrl',
      },
    },
  });
};
