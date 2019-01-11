angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.depositMovement', {
    url: '/depositMovement',
    views: {
      'groupView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/billing/depositMovement/telecom-telephony-billing-account-billing-deposit-movement.html',
        controller: 'TelecomTelephonyBillingAccountBillingDepositMovementCtrl',
        controllerAs: 'BillingAccountDepositMovementCtrl',
      },
    },
    translations: ['.', '..'],
  });
});
