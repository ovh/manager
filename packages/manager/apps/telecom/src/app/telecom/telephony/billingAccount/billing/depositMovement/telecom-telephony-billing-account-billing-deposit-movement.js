angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.depositMovement', {
    url: '/depositMovement',
    views: {
      'groupView@telecom.telephony.billingAccount': {
        templateUrl:
          'app/telecom/telephony/billingAccount/billing/depositMovement/telecom-telephony-billing-account-billing-deposit-movement.html',
        controller: 'TelecomTelephonyBillingAccountBillingDepositMovementCtrl',
        controllerAs: 'BillingAccountDepositMovementCtrl',
      },
    },
    translations: { value: ['.', '..'], format: 'json' },
    redirectTo: (transition) =>
      transition
        .injector()
        .get('TelephonyMediator')
        .getGroup(transition.params().billingAccount)
        .then((group) =>
          group.isNicAdmin || group.isNicBilling
            ? false
            : 'telecom.telephony.billingAccount',
        ),
  });
});
