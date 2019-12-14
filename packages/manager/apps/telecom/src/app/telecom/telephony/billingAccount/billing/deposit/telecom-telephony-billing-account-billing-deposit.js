angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.billing.deposit', {
    url: '/deposit',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl:
          'app/telecom/telephony/billingAccount/billing/deposit/telecom-telephony-billing-account-billing-deposit.html',
        controller: 'TelecomTelephonyBillingAccountBillingDepositCtrl',
        controllerAs: 'BillingDepositCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
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
