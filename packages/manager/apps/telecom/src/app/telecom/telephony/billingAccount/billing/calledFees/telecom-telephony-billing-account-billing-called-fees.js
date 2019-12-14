angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.billing.calledFees', {
    url: '/calledFees',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl:
          'app/telecom/telephony/billingAccount/billing/calledFees/telecom-telephony-billing-account-billing-called-fees.html',
        controller: 'TelecomTelephonyBillingAccountBillingCalledFeesCtrl',
        controllerAs: 'CalledFeesCtrl',
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
